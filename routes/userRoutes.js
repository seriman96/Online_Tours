const express = require('express');
//include controller 
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require('./../controllers/userController'); //userController.js controller n here for this usage we'll tackle directly the imported method
const authController = require('./../controllers/authController'); //importing authController.js
const userController = require('./../controllers/userController');
const { route } = require('./reviewRoutes');


//it's a convention to name routing variable to router so we'll change tourRouter to router
const router = express.Router();

//replace by userController(tour route handlers)


//implementing some route for user resources
router.post('/signup', authController.signup); //signup route

router.post('/login', authController.login); //login route
router.get('/logout', authController.logout); //logout route

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);// /:token here in the request is a req params

//Putting authentication
//Protect all route after this middw
router.use(authController.protect); //this code is here to say that all the route that comes after this code line(means below follwing code line) will be under protected route means will submitted to authentication

router.patch('/updateMyPassword', authController.updatePassword); //no need of authController.protect it gets replace by router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser); //no need of authController.protect it gets replace by router.use(authController.protect);

router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe); //no need of authController.protect it gets replace by router.use(authController.protect);
router.delete('/deleteMe', userController.deleteMe); //no need of authController.protect n it gets replace by router.use(authController.protect);

//after this middw, all the route will be under that restriction : means after this middw all the route will be under 1st middw(authController.protect) and 2nd middw(authController.restrictTo) here
router.use(authController.restrictTo('admin'));

router
.route('/')
.get(getAllUsers) 
.post(createUser); //route under authentication bcs of router.use(authController.protect);

router
.route('/:id')
.get(getUser) 
.patch(updateUser)
.delete(deleteUser); //route under authentication bcs of router.use(authController.protect);

module.exports = router;