const mongoose = require('mongoose'); // used to establish connection btw app to mongodb through mongo driver
const slugify = require('slugify'); //used  for string formatting
const validator = require('validator'); //for validator lib usages it's a plugin for custom validator
//const User = require('./userModel'); // userModel.js usage

//for building a model we should built a schema object
//we'll add 2nd param(object for schema option) to mongoose schema method which is an object also as the 1st param(object for schema definition) in order to accept virtual properties
const tourSchema = new mongoose.Schema({
    name:{ //it's called schema type object
        type: String, //object type
        required: [true, 'A tour must have a name'], //make it require n if not filled or satisfied show error msg which is 2nd param n it's an inbuild validator
        unique: true, //set the field to unique
        trim: true,
        maxLength:[40, 'A tour name must have less or equal than 40 characters'], //this attrib is also an inbuild validator n will set the maxi character for us
        minLength:[10, 'A tour name must have more or equal than 10 characters'], //this attrib is also an inbuild validator n set minimum length character for us here 10
        //custom validator usage through validation plugin(class)
        //validate: [validator.isAlpha, 'Tour name must only contain characters'], //will check if name field is coming as a valid alphabet means only alphabet n it won't accept space on the string

    },
    //in order to do modification on coming req from slugify we should add that field to the model
    slug: String,
    duration:{
        type:Number,
        required:[true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true, 'A tour must have a difficulty'],//normal notation is:{values:true,message:'A tour must have a difficulty'}
        //set difficulty field for 3 values only 
        enum:{ //enum stand for enumerator n it set a const array value for us here n it's an inbuild validator n enum works only for string value
            values: ['easy', 'medium', 'difficult'], 
            message: 'Difficulty is either: easy, medium, or difficulty',
        } 
    },
    ratingsAverage:{
        type:Number,
        default:4.5, //gives default value to rating field
        min:[1, 'Rating must be above 1.0'], //an inbuild validator to set min value for ratingsAverage
        max:[5, 'Rating must be below 5.0'], //an inbuild validator to set min value for ratingsAverage
        //borrowing"arrondi" ratings average
        //set: val => Math.round(val * 10) / 10,   //this function will be run each time that a new value is set for this field n val is the current value of the field
        //so roun() return an integer means when we're 4.666 will return 5, to avoid that we do value*10/10 so we'll got 4.7
        // set funct here will run each time when there is a new value for ratingsAverage
    },
    ratingsQuantity:{
        type:Number,
        default:0 //gives default value to rating field
    },
    price:{
        type: Number,
        required: [true, 'A tour must have a number'] //the required attrib is called the validator bcs it's used to validate the data
    },
    priceDiscount:{
        type: Number,
        //custom validator building n it is our own creating validator n to use it we should use validate key(keyword) as below
        /*validate:{
            validator: function(val){
                //the keyword 'this' only points to current doc on new document creation
                return val < this.price; // val here is discount value n this.price is the price of current doc n when condition satisfied no validation else validation error will be fired
            },
            message: 'Discount price ({VALUE}) should be below regular price' //VALUE here is a mongoose expression n it return the internal value of the validator which r discountPrice
        }*/
        
    },
    
    summary:{
        type: String,
        trim: true, //it's a schema type of string data type n used to remove the white space from begining n ending of the string
        required: [true, 'A tour must have a description']
    },
    description:{
        type: String,
        trim: true, //it's a schema type of string data type n used to remove the white space from begining n ending of the string
    },
    imageCover:{
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images:[String],//means we've array of string here
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false, //used to disable this field when selection means showing
    },
    startDates:[Date], //means we've array of date here

    //geospatial data is basically data that describes places on earth using longitude and 
    //latitude coordinates n mongodb uses a special data format called GeoJSON in order to specify geospatial data
    //and the object defined for Geospatial data is not a schema type object, it's an embedding object
    // n it allowed us to specified a couple of properties
    //In order to specified geospatial data with mongodb, we basically need to create a new object such as we did below
    //And that object then needs to have at least two fields name:
    //(coordinates: as array of nber n then type: which should be of type string n should be either point or other design geometries)
    startLocation: {//startLocation is not really a doc itself, it's really n object describing a certain point on earth  
        // GeoJSON
        type: {
          type: String,
          default: 'Point', //geometries type value n this one here is the default value n we can have line,polygon,...
          enum: ['Point'] //the possible option that this field can take n we specified only one here that is point
        },
        coordinates: [Number], //we expect an array of nber n it is the coordinate of the point with longitude 1st and only 2nd the latitude 
        address: String,
        description: String
      },
    //in order to really create new docs n then embed them into another doc, we actually need to create n array n that one we're going to do for locations
    locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number //this one is the day of the tour in which people will go to this location, day where people will reach tour
        }
      ],  
    //Embedding the user docs into the tours docs
    //  guides: Array,

    //establishing referencing between user docs and tours docs. We've child references here
    guides: [
        {
          type: mongoose.Schema.ObjectId, //will take mongoose object id as type means mongodb object id n used to reference with ObjectId
          ref: 'User' //Establish references between tours docs and user docs n it doesn't require to import the userModel Class
        }
      ],
//Used to serve reviews field as field where we'll apply the virtual populate on top of it from tour docs
    /*review: [
        {
            type : mongoose.Schema.ObjectId,
            ref: 'Review',//Establish references between tour docs n Review docs
        }
    ],*/// we're going to implement virtual populate instead of doing like above used for normal populate usecases

    //process called populate used in order to actually get access to the referenced tour guides 
    //field whenever we query for a certain tour n it's basically replace  the field that we referenced
    //with the actual related data.And the result of that will look as if the data has always been embedded
    //when in fact, as we know, it is in a completely #t collection n the populate process always happens in a query
    //n we'll go to tourController n apply populate to a single tour query which r getTour()

    //field for query middleware
    secretTour:{
        type: Boolean,
        default: false
    }

}, {
    toJSON:{virtuals:true}, //concern for each time when data is outputed as json so used basically for the virtual to be part of the output
    toObject:{virtuals:true} //when the data get outputed as an object
});

//Read performance in Mongoose and indexing
//Indexing implementation for efficient fetching in database. And indexes is used to search into a document
//indexing can make our read performance on database much, much better.And we should not ignore it in our application
//below doing indexes is called a single field indexing
//tourSchema.index({price:1}); //will set indexing for price field n value 1 means we'll sort the price index in ascending order n -1 means descending n indexin is used for gaining performance when querying 
//combined query with another one is more efficient to create a compound index so when it's 2 fields not just one
//as example
tourSchema.index({price: 1, ratingsAverage: -1}); //compound index used to improve the query performance
//And when we create a compound index, no need to do for a single or individual indexing for every field. 
tourSchema.index({slug: 1}); //applied indexing on slug field for searching performance on this field here n if we want an indexes we should do it on the database

//For being able to do queries on geospatial data we've to add index to the concerned field
tourSchema.index({startLocation: '2dsphere'}); //for geospatial data, indexing need to be the 2D sphere index if the data describes a real points on the earth like sphere n if we're using a fuctional points on a simple 2 dimensional plane. 

//calculating the average ratings(ratingsAverage) and also the nber of rating of a tour each time that a new review is added to that tour or also when a review is updated or deleted
//bcs those r the situation when the nber or the average might change
//To calculate that we'll create a new function on reviewModel which will take a tour Id and calculate the avg ratings n the nber of ratings that exist in our collection for that exact tour.
//And in the end the function will event update the corresponding tour document.Then in order to use that function we'll use middw to basically call this function each time that 
//there is a new review or one is updated or deleted
//start writing that function n for that we're going to write a static method on our schema, and that's a feature of Mongoose

//Virtual properties in model building it is the one which is not store in database
//we can not used the virtual property in a query for exple we can't say Tour.find().WHERE('durationWeeks').equals(5) bcs it's that property is not part of database
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7; //will return the duration by week n this keyword goes with regular function
}); // when we get some data out of the database the virtual properties will be created n the get() method is called a getter to get those data 

//virtual population: connecting parent table field (_id) which in reference(child) table is (tour) field
tourSchema.virtual('reviews', {
    ref: 'Review', //table Review
    foreignField: 'tour', //the reference field for Tour docs in Review docs is tour field or foreign field of tour docs in Review docs n the correspondent field from tour docs in below
    localField: '_id' //is tour_id field here bcs tour reference field is tour in Review docs n it's _id field on it own
});
 
//Mongoose Middleware used to make something happen btw 2 event for exple each time a new doc is saved 
//to the db we can run a function btw the save command issued n the actual saving of the docs or after the actual savings 
//there are 4 types of Middleware in mongoose:document,query,aggregate n model middleware n the 1st 3 is for mongoose middlw
// In this chap we're talking about docs middleware which middleware that can acts on the currently process doc it's mongoose docs

//document middleware: runs before .save() command and .create() command only n it won't run for update() command ...
tourSchema.pre('save', function(next){ //this is pre-middleware n it can run before an actual event n the event here is save operation
    //console.log(this) //this keyword is the currently process doc used here for accessing the current doc before saving in db
    this.slug = slugify(this.name, {lower: true }); //will format the current doc name field into lowerCase
    next(); //it allows us to move out of the middleware

}) 

//Docs middw to embed user data to tours data: this one is not a good practice here bcs we want to do update it'll be a real mess for that we'll go for referencing n not embedding 
/*tourSchema.pre('save', async function(next){ 
    const guidesPromises = this.guides.map(async id => await User.findById(id)); //looping through on an array of the user id n here this line of code will output n array full of promises means array of promises
    this.guides = await Promise.all(guidesPromises); //will overwrite the array of simple id with an array of user docs n we need to use Promise.all() bcs the result above code line is a promise
    next(); //it allows us to move out of the middleware
//this block of code works only for creating a new doc and won't work for updating
/* way to test from postman
{
    "name":"Next Test Tour",
    "duration":1,
    "maxGroupSize":1,
    "difficulty":"easy",
    "price":200,
    "summary":"Breathtaking hike through the Canadian Banff National Park",
    "imageCover":"tour-1-cover.jpg",
    "ratingsAverage":1,
    "guides":[
        "628038288db7d41cbf99d538",
        "628a1f6c5f2b28bb6d45301a"
    ]
}*/
//})

/*tourSchema.pre('save', function(next) {
    console.log('Will save document.....');
    next();
})

tourSchema.post('save', function(doc, next){ //it has access to the docs that was just saved to the db
    console.log(doc); //doc marginize the document that was just saved
    next();
}) */

//Query middleware: which is based on the mongoose query
tourSchema.pre(/^find/, function(next){ //1st param means our middleware run for find() command either findOne() ... n find() method here will point to the current query n not to the current docs which is doc middleware
    this.find({secretTour:{$ne: true}}); //find in current query where secretTour not equal to true
    
    this.start = Date.now(); //will saved the current time
    next();
});

//Process populate with query middleware
tourSchema.pre(/^find/, function(next) {
    this.populate({ //here keyword this will point the current query means populate() will be applied to the current query
      path: 'guides', //field where populate function to be applied
      select: '-__v -passwordChangedAt' //used here with sign (-) means to get rid of showing those given field here from output
    }); //here all the query will then automatically populate the guides field with the referenced user 
  
    next();
  });

//in order to do middleware for findOne() query
/*tourSchema.pre('findOne', function(next){  //this part of middleware will be solve by above middleware bcs of regular expression /^find/
    this.find({secretTour:{$ne: true}}); 
    next();
})*/
tourSchema.post(/^find/, function(docs, next){ //1st param means our middlw run for find() command either findOne()... include all kind of find query n find() method here will point to the current query n not to the current docs which is doc middleware
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    //console.log(doc); 
    next();
});

//Aggregation middleware: which will fire before or after an aggregate mongoose
/*tourSchema.pre('aggregate', function(next){
    //shift() add the elt at the end of an array in js n  unshift() does the opposite
    this.pipeline().unshift({ $match:{secretTour:{$ne: true}} }); //used in order to add this aggrega middleware to the previous aggrega we've done n the aggrega part here will remove from the output of all the doc that have secret tour set to true
    console.log(this.pipeline());
    next();
});*/ //block of code got commented here bcs $geoNear in geospatial aggregate defined in tourController should be the first operator in the pipeline 

//sanitization(it's about to clean the data coming from user) n validation of data here we'll focus on validation

//creating model for our above schema object
const Tour = mongoose.model('Tour', tourSchema); //model is like a class in js n model name is Tour

module.exports = Tour; //used to export the model
