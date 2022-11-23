const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();
  
//applied this middw to all the below route
//router.use();

router.get('/signup', viewController.getSignUpForm);
router.get('/sign', authController.isLoggedIn, viewController.getSignForm, viewController.getLoginForm);

router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview); //authController.isLoggedIn is not a protected route n will run for the request
//router.get('/', authController.isLoggedIn, viewController.getOverview);

//router.get('/', authController.isLoggedIn, viewController.getOverview); //authController.isLoggedIn is not a protected route n will run for the request
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/cours', authController.protect, viewController.getCours);
router.get('/read', authController.protect, viewController.getCour);
router.get('/course', authController.protect, viewController.searchTours);
router.get('/cours/:id', authController.protect, viewController.updateTours);
router.get('/crs/:id', authController.protect, viewController.uploadCrs);
router.get('/cour/:id', authController.protect, viewController.deleteTours);
router.get('/update', authController.protect, viewController.updateTour);
router.get('/upd', authController.protect, viewController.uploadTour);
router.get('/delete', authController.protect, viewController.deleteTour); // 
router.get('/read-5', authController.protect, viewController.top2tours);
router.get('/month-course', authController.protect, viewController.monthlytours);
router.get('/course-stats', authController.protect, viewController.toursstats);
//admin operat
router.get('/search-user', authController.protect, viewController.searchuser); 
router.get('/update-user', authController.protect, viewController.Updsuser);
router.get('/updat/:id', authController.protect, viewController.Updsusers);
router.get('/reads/:id', authController.protect, viewController.searchusers); 
router.get('/delete-user', authController.protect, viewController.deltusers);

router.get('/usr', authController.protect, viewController.getUsr);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/forgotPassword', authController.isLoggedIn, viewController.forgotPasswordForm);
router.get('/resetPassword/:token', authController.isLoggedIn, viewController.resetPasswordForm); //viewController.forgotPasswordForm,

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours); 
router.get('/my-reviews/:id', authController.protect, viewController.getMyReviews);
router.get('/reviews/:id', authController.protect, viewController.updateMyReviews);
router.get('/review/:id', authController.protect, viewController.deleteMyReviews);
router.get('/:id/my-review', authController.protect, viewController.createMyReviews);

//for user edeting route by traditional methode meams form with action n method
router.post('/submit-user-data', authController.protect, viewController.updateUserData);


module.exports = router