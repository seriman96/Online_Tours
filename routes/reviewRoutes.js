const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//route creation
//merge params concept is used to balance the nested route
//router.use('/:tourId/reviews', reviewRoute); //in order to say the tour router should used the review router n a router itself is a middw n we can applied use() on it n this techniq is called mounting a router
//and the review router is not accessing the tour router here in order to solve that we should activate it from review router as below with help of merge params concept

const router = express.Router({ mergeParams: true }); //activate express route in order to create a route and we're activating mergeParams here bcs by default each router only have access to the parameters of their
//specific routes n mergeParams: trues is used to complete this //router.use('/:tourId/reviews', reviewRoute); connection

//No one can access review route before getting authenticated, after this middw here. so it's get applied for all route here
router.use(authController.protect);

//here they don't know about tour id but we still want to get access to the tour id that was in this other router(tour router here) so in order to get access we need activate mergeParams as defined above.so
//matter if we get a route like 
//POST /tour/tour_id/reviews or like 
//POST /reviews     it will automatically handle
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'), //only user should be able to post review, no admin, guide,... can do
    reviewController.setTourUserIds,
    reviewController.createReview
  ); 

//implementation of getting reviews coming under one specific tour
//like 
//GET /tour/tour_id/reviews
//with the help of merger params get activate we've accessed to tour_id means whenere similar resquest comes(GET /tour/tour_id/reviews) will be directed to reviewController.getAllReviews

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'), //only user n admin should be able to update the review(commentaire), no guide or .. can do
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'), //only user n admin should be able to update the review(commentaire), no guide or .. can do
    reviewController.deleteReview
  );

module.exports = router;
