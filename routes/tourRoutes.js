const express = require('express');
//include controller
const authController = require('./../controllers/authController'); //importing authController.js
const tourController = require('./../controllers/tourController'); // import tourController.js 
//const {getAllTours, createTours, getTours, updateTours, deleteTours} = require('./../controllers/tourController') //for this usage we'll tackle directly the imported method
//const reviewController = require('./../controllers/reviewController');
const reviewRoute = require('./reviewRoutes');

//creating one seperate router for each resources

//it's a convention to name routing variable to router so we'll change tourRouter to router
const router = express.Router(); //create router for Tour resources n app variable will be replace to the router created 

//param middleware is middleware that only run for some parameter
/*router.param('id',(req, res, next, val)=>{//id here is the param we're working on it n val argument is the value of parameter n next argument allow to the middleware to not be stack so to move on to the middleware
    console.log(`Tour id is: ${val}`);
    next();
});*/

// param middleware in order to avoid DRY in those method created in tourRoutes.js
//router.param('id',tourController.checkID);
 
//create a checkBody middleware 
//check if body contains the name n price property
//if not, send back 400(bad request)
//Add it to the post handler stack to do that we'll do router.post(middleware, tourController.createTours);

//exports.checkBody to be imported from tourController.js n applied the work

//replace by tourController(tour route handlers)

//implementing route for limit n sort param with req coming n to be implemented with middleware here middleware is aliasTopTours
router
.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours); // when someone tape /top-5-cheap in url the 1st middleware will be executed which are tourController.aliasTopTours

//new route for Tour Aggregation pipeling
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/montly-plan/:year').get(authController.protect, authController.restrictTo('admin','lead-guide', 'guide'), tourController.getMontlyPlan); //restricted for only normal people like 'admin','lead-guide', 'guide' here

//Geospatial route: 1st params distance where tour is located n 2nd params your(visitor) actual location, 3rd params the unit of the distance where it's in km or in miles
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
//same can be written as below
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

//Geospatial Aggregate route 
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);


//Better way to do above routing with a new routing tech
//Putting authentication
router // tourRouter already contain this /api/v1/tours
.route('/') //here either api/v1/tours we've / bcs of tourRouter
.get(tourController.getAllTours) //we got rid of this authController.protect, from the route bcs we don't want user to be authenticated for getting tour: authController.protect middleware will first run n then if user is not authenticated there will be n error n then will go the next midllwre which is getAllTours n it won't be executed here n that avoid unnecessary authorization
.post(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.createTours); //tour creation limited by admin and lead-guide.
//.post(tourController.checkBody, tourController.createTours); //use of mutiple middleware

router
.route('/:id')
.get(tourController.getTours)
.patch(authController.protect, 
    authController.restrictTo('admin','lead-guide', 'guide'), 
    tourController.uploadTourImages,
    tourController.resizeTourImages, 
    tourController.updateTours) //tour updation limited by admin and lead-guide
.delete(authController.protect, authController.restrictTo('admin','lead-guide', 'guide'), tourController.deleteTours);//1st middlw for authentication(for user login),2nd middlw for authorization(here authorize admin n lead-guide for some action(delete action here)),last middlw for deleting purposes

//Nested routes
//POST /tour/tour_id/reviews  in one route n it's called nested route n it means to access the review resource on the tour's resource means to have all the reviews on this tour
//GET /tour/tour_id/reviews/reviews_id it means we'll get the reviews with the specify review_id here on the tour with the tour_id
//n we'll implement this techniq on tour route first
/*router
.route('/:tourId/reviews')
.post(authController.protect, authController.restrictTo('user'), reviewController.createReview); //authController.restrictTo('users') means allowed access to only users
*/

//merge params concept is used to balance the nested route as was done in above
router.use('/:tourId/reviews', reviewRoute); //in order to say the tour router should used the review router n a router itself is a middw n we can applied use() on it n this techniq is called mounting a router
//and the review router is not accessing the tour router here in order to solve that we should activate it from review router by doing express.Router({ mergeParams: true }) for based route of review

//A factory function is a function that returns another function for us and in our case here will be for deleting handler,updating,creating,and also for reading resources and implemented in handlerFactory.js class

module.exports = router;