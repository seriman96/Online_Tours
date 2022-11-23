const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
//const catchAsync = require('./../utils/catchAsync');

/*exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};*/

//exports.getAllReviews = factory.getAll(Review);
//exports.getReview = factory.getOne(Review);
//exports.createReview = factory.createOne(Review);
//exports.updateReview = factory.updateOne(Review);
//exports.deleteReview = factory.deleteOne(Review);

/*exports.getAllReviews = catchAsync(async (req,res, next)=>{ 
//implementation of getting reviews coming under one specific tour
//like 
//GET /tour/tour_id/reviews
//with the help of merger params get activate we've accessed to tour_id means whenever similar resquest comes(GET /tour/tour_id/reviews) will be directed to reviewController.getAllReviews
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId}; //if there is a tour that id will be store in filter n we'll find review based that as below 

    //Executing Query
    const review = await Review.find(filter);

    //Send Response
    res.status(200).json({
        status:'success',
        result: review.length,
        data:{
            reviews: review
        }
    })
    
    });*/ //replaces by generalize function from handlerFactory.js class as below
exports.getAllReviews = factory.getAll(Review); //we passed Review as it concern review doc here


//this part of code is not defined in createOne() handlerFactory.js class so in order to handle that we'll follow as below
exports.setTourUserIds = (req, res, next) => { //we'll route this middw before createReview middw in order to combine them as it was defined in createReview middw below
    //Allow nested route
    if(!req.body.tour) req.body.tour = req.params.tourId; //will if we didn't specify the tour id in body then we want to define that as one coming from the url
    if(!req.body.user) req.body.user = req.user.id; //same as above but for the user n here we get req.user from the protect middw
    next();
}


/*exports.createReview = catchAsync(async (req, res, next) => {
    //Allow nested route
    if(!req.body.tour) req.body.tour = req.params.tourId; //will if we didn't specify the tour id in body then we want to define that as one coming from the url
    if(!req.body.user) req.body.user = req.user.id; //same as above but for the user n here we get req.user from the protect middw
    //const doc = await Model.create(req.body);
    const doc = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });*/ //replaces by generalize function from handlerFactory.js class as below
exports.createReview = factory.createOne(Review); //we passed Review as it concern review doc here


/*exports.getReview = catchAsync(async (req,res, next)=>{ 

    const review = await Review.findById(req.params.id);
    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!review){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status:'success',
        data:{
            review
        }
    })
});*/ //replaces by generalize function from handlerFactory.js class as below
exports.getReview = factory.getOne(Review); //we passed Review as it concern review doc here


/*exports.updateReview = catchAsync(async (req,res, next)=>{

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,//means new updated doc will be returned
        runValidators:true, //if true, run validators on this command n validate the update operation against model's schema
        //runValidators:false,
    });

    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!review){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No revew found with that ID', 404));
    }

    res.status(200).json({
        status:'success',
        data:{
            review
        }
    }) 
    });*/ //replaces by generalize function from handlerFactory.js class as below
exports.updateReview = factory.updateOne(Review); //we passed Review as it concern review doc here

/*exports.deleteReview = catchAsync(async (req,res, next)=>{
    //the below block of code(the comment block) is repeating  with the above method so that is DRY in order to avoid that the should be replace by param middleware
        
    //try { //try/cacth replace by catchAsync()
    const review = await Review.findByIdAndDelete(req.params.id);
    res.status(204).json({ //204 means there is no content
        status:'success',
        data: null //it's a common pratice to not send a data to a user when deleting operation
    });

    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!review){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No review found with that ID', 404));
    }
    
});*/ //replaces by generalize function from handlerFactory.js class as below
exports.deleteReview = factory.deleteOne(Review); //we passed Review as it concern review doc here