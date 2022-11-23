const mongoose = require('mongoose');



const bookingSchema = new mongoose.Schema(
  {
    //parent referencing
    tours: {
        type: mongoose.Schema.ObjectId, //references with objectId as type here
        ref: 'Tour', //Establishes references between reviews docs and Tour docs n it doesn't require to import the tourModel Class
        required: [true, 'Booking must belong to a tours.']
     },
    //parent referencing
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User']
    },
    price: {
      type: Number,
      required: [true, 'Booking must belong to a price.'] 
    },
    //timestamp creation
    createdAt: {
      type: Date,
      default: Date.now()
    },
    //payment outside the credit card like it can be cash or something else when customer don't have stripe access
    paid:{
        type: Boolean,
        default: true
    },
    
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Avoiding duplicate review means same user posting many review on same 
//For that we should used unique index
//bookingSchema.index({ cours: 1, user: 1 }, { unique: true });//will allowed each combination of tour n user to be unique n we'll not be able to create 2 reviews coming to the same user 

bookingSchema.pre(/^find/, function(next) {

  this.populate('user').populate({
    path: 'tours',
    select: 'name'
  });
  next();
});

/*
bookingSchema.statics.calcAverageRatings = async function(tourId) {
  //Aggregate pipeline usage
  const stats = await this.aggregate([ //applying aggregate on top of reviewmodel current docs
    {
      $match:{cours:tourId} //means select all reviews that match the current tour id
    },
    {
      $group:{
        _id: '$cours', //we'll group all the tours together by tour id here 
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
bookingSchema.post('save', function(){
  this.constructor.calcAverageRatings(this.cours);//calls above static method n pass it current review tour id
  //next();
}); 

bookingSchema.pre(/^findOneAnd/, async function(next){
  //this middw is a query middw n to have access to the docs of query we've to pass by this query as done below this.findOne()
  //this.r is instance attrib here n is available from the next middw which is below post middw n it's used to pass data from pre middw here to next post middw
  this.r = await this.findOne().clone().catch(function(err){ console.log(err)}); //we added line code  .clone().catch(function(err){ console.log(err)}) here in order to solve 
  
  next();
});

bookingSchema.post(/^findOneAnd/, async function(){
  
  await this.r.constructor.calcAverageRatings(this.r.cours); //this.r.tour is current tour_id on top of current review n this.r is used to retreive a review docs on it.
})*/


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
