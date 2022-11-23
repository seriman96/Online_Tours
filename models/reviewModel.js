// review / rating / createdAt / ref to tour / ref to user //here we'll implement parent referencing bcs tour n user r parent of review here
const mongoose = require('mongoose');
const Tour = require('./tourModel');

//Nested routes
//POST /tour/tour_id/reviews  in one route n it's called nested route n it means to access the review resource on the tour's resource means to have all the reviews on this tour
//GET /tour/tour_id/reviews/reviews_id it means we'll get the reviews with the specify review_id here on the tour with the tour_id
//n we'll implement this techniq on tour route first

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    //parent referencing
    tour: {
      type: mongoose.Schema.ObjectId, //references with objectId as type here
      ref: 'Tour', //Establishes references between reviews docs and Tour docs n it doesn't require to import the tourModel Class
      required: [true, 'Review must belong to a tour.']
    },
    //parent referencing
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Avoiding duplicate review means same user posting many review on same 
//For that we should used unique index
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });//will allowed each combination of tour n user to be unique n we'll not be able to create 2 reviews coming to the same user 

reviewSchema.pre(/^find/, function(next) {
//if we want to populate multiple fields,what we need to do is to call populate again it like populate apply on top of another populate 
//as done below
   //this.populate({ //applied populate on the field tour from reviews to access tour docs
    // path: 'tour',
    // select: 'name'
   //}).populate({
    // path: 'user',
    // select: 'name photo' //will select 2 fields from user data name n photo
   //}); //using populate is taking so much time when executing a query
//the above block code with the virtual populate technique is making redundancy on the query output to avoid that we use as below

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

//with parent referencing, the parent doesn't know about the child.And if we want parent to know about the child
//we have 2 ways to do: 1st manually exple: here tour docs is parent of review docs so tour docs to know about review docs with 
//manual way we should query tour docs n at the same time query review also
//And the 2nd way or solution should be the child referencing of the review docs on tour docs means keep n array of all the review
//ID's on each tour doc.And all we've to do is to populate that array.
//However, mongoose offers us a good solution for that problem with pretty advanced feature called virtual populate
//virtual populate is like a way of keeping that array of review ID's on a tour doc, but without actually persisting it to the database
// And used to solve the child referencing here in 2nd way of solution. we implemented that technique on tourModel.js btw tour docs n reviews docs

//calculating the average ratings(ratingsAverage) and also the nber of rating of a tour each time that a new review is added to that tour or also when a review is updated or deleted
//bcs those r the situation when the nber or the average might change
//To calculate that we'll create a new function on reviewModel which will take a tour Id and calculate the avg ratings n the nber of ratings that exist in our collection for that exact tour.
//And in the end the function will event update the corresponding tour document.Then in order to use that function we'll use middw to basically call this function each time that 
//there is a new review or one is updated or deleted
//start writing that function n for that we're going to write a static method on our schema, and that's a feature of Mongoose
//Mongoose static method creation
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  //Aggregate pipeline usage
  const stats = await this.aggregate([ //applying aggregate on top of reviewmodel current docs
    {
      $match:{tour:tourId} //means select all reviews that match the current tour id
    },
    {
      $group:{
        _id: '$tour', //we'll group all the tours together by tour id here 
        nRating: { $sum : 1 },//nber total of rating
        avgRating: {$avg: '$rating'},
      }
    },
  ]);
  //console.log(stats); //return an array of tour object like [{ _id: new ObjectId("62928b0110bfc57c159b4513"),nRating: 2, avgRating: 3.5}]
  //Changing Tour docs with the above average calculation value means saved the statistic to the current tour
  if(stats.length > 0){ //will check if stats array is not empty then do update else go to else{}
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating, //these r object that we want to update
      ratingsQuantity:stats[0].nRating
    });
  }else{
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0, //these r object that we want to update n the default value is reconducted here
      ratingsQuantity:4.5
    })
  } 
}
//uSING new middw to call the static method created above in order to use that function,when new review is added to the tour
//reviewSchema.pre('save', function(next){ //instead of using the pre save middw here we should used post save middw 
  //bcs with pre save middw, the current review is not really in the database collection just yet.
  //so therefore, where we then do the match aggregat here it shouldn't be able to then appear in the output here.bcs 
  //again at this point in time it's not really saved into the collection just yet.
  //n it's best to use post save middw bcs at that time, of course, all the docs r already saved in the database n it's a great time 
  //to do a calculation with all the reviews already and then store the result on the tour.
  //And post save middw don't have access to the next function so we have pass next on argument steps next with next here.   
reviewSchema.post('save', function(){
  //keyword this here point to current review
  //this.constructor; //instanciate review class for current docs n used to solve below object instance Review,which is used here before instanciation
  //Review.calcAverageRatings(this.tour); //calls above static method n pass it current review tour id n Review object is not accessible here in order to fix that we should do as below
  this.constructor.calcAverageRatings(this.tour);//calls above static method n pass it current review tour id
  //next();
}); 

//For calculating the average ratings(ratingsAverage) and also the nber of rating of a tour each time when a review is updated or deleted
//bcs those r the situation when the nber or the average might change
//docs got update or delete when we're:
// findByIdAndUpdate n findByIdAndUpdate is only just a shorthane for findOneAndUpdate with the current ID same for findByIdAndDelete
// findByIdAndDelete
//TO solve above problem we'll implement a pre query middw which accept only all query starting by findOneAnd means findOneAndUpdate n findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next){
  //this middw is a query middw n to have access to the docs of query we've to pass by this query as done below this.findOne()
  //this.r is instance attrib here n is available from the next middw which is below post middw n it's used to pass data from pre middw here to next post middw
  this.r = await this.findOne().clone().catch(function(err){ console.log(err)}); //we added line code  .clone().catch(function(err){ console.log(err)}) here in order to solve 
  //this problem MongooseError: Query was already executed: Review.findOne({ _id: new ObjectId(\"629288bdf1786ce72bf96345...\n at model
  //this.findOne() is used here to have current query by the way we'll have current docs via that current query
  //console.log(this.r);
  next();
});
//After the update query get executed from above middw, we'll create a post save middw to apply the changes to our docs
//for that we should pass data from pre middw to post middw
reviewSchema.post(/^findOneAnd/, async function(){
  //await this.findOne(); DOES NOT work here, Query has already executed
  //this.r is current review where pre middw update query has been applied.
  await this.r.constructor.calcAverageRatings(this.r.tour); //this.r.tour is current tour_id on top of current review n this.r is used to retreive a review docs on it.
})

/*reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};*/

/*reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});*/

// findByIdAndUpdate
// findByIdAndDelete
/*reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});*/

/*reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});*/

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
