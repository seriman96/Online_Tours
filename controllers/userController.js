const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync'); //for catchAsync.js class usages
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory'); // generalize function of specific crud function for our model
const multer = require('multer'); //form-data format used for file or img uploading
const sharp = require('sharp');

/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => { //cb here is like next from async funct n it's not coming from express n it's called callback
    cb(null, 'public/img/users'); //1st param is for err n we expect here no error n 2nd is for the destination for uploaded file
  },
  filename: (req, file, cb) => { //file here equal to req.file
    //we want to name file as user-user_id-timestamp_number.fileExtension like user-77458962gf5412-33568921.jpeg
    //mimetype from req.file is returning the file extension which value 'image/jpeg'
    const ext = file.mimetype.split('/')[1]; // split('/')[1] used to have extension from mimetype value which is 'image/jpeg'
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // `user-${req.user.id}-${Date.now()}. ${ext}` returned file naming
  }
});*/ //before keep image in rom disk it's always to place in ram for preprocessing need that's y this block of code here get commented

const multerStorage = multer.memoryStorage(); //will saved image as a buffer for current preprocess need n it's available for req.file means req.file.buffer we can access file 

//(req, file, cb) => {} called callback function
const multerfilter = (req, file, cb) =>{ //this function is used here to test if uploaded file is an image or not but we can implement for all type of file
  if(file.mimetype.startsWith('image')){ //file.mimetype.startsWith('image') bcs image is uploaded we'll always have image as 1st string from mimetype
    cb(null, true); //allowed n no error
  }else{
    cb(new AppError('Not an image! Please upload only images.', 400) , false);
  }
};

//multer configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerfilter
}); //dest shows folder that wanna receive all the uploaded image n we can call multer() without any argument n will it'll be save in memory for the working  time

exports.uploadUserPhoto = upload.single('photo');

//image processing middw in order to preprocess for our need
exports.resizeUserPhoto =catchAsync(async(req, res, next) =>{
  if(!req.file) return next(); //if no image go to next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; //here we give .jpeg as extension for all img bcs when preprocessing we set it as that by toFormat()
 
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/users/${req.file.filename}`); //sharp(req.file.buffer) this class has numerous number of method for img 
  //processing n resize(500,500) is width n height n toFormat('jpeg') will convert all the received img into jpeg  n jpeg() is used to add quality factor to the img
  //n quality:90 is for quality value n it's in percentage here n toFile() will saved file after processing into a rom disk
  next();
});

//const tours =JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));//JSON.parse() convert json object to js object

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => { //looping through all field n 
      if (allowedFields.includes(el)) newObj[el] = obj[el]; //check if specific elt is included in allowedFields then added to the new object created

    });
    return newObj;
};

/*exports.getAllUsers = catchAsync(async(req, res, next) => {
    //500 status code means internal server error 
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
        users
        }
    });
}); */  //replaces by generalize function from handlerFactory.js class as below
exports.getAllUsers = factory.getAll(User); //we passed User as it concern User doc here
 
//implement (me and endpoint data): implementing (me) is used to have or get the current user
//this part of code is not defined in getOne() handlerFactory.js class so in order to pass to it we'll follow as below 
exports.getMe = (req, res, next) => { //we'll route this middw before getUsers middw in order to pass getMe middw de getUsers middw
  req.params.id = req.user.id; //we should passed to protected route in order to access req.user
  next();
}

//updating the currently authenticated user that one middleware might be implemented on userController
//below middleware is used to update the current user data
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email'); //we want to keep only name n email field here to be updated means we'll filter out the rest of field from req.body content
    //if there is an uploading image change saved field value with that which is photo done below
    if(req.file) filteredBody.photo = req.file.filename; //will add photo field or property to the object that is going to be updated here

    // 3) Update user document
    /*const updatedUser = await User.findById(req.user.id, x, {new: true}); // x here is data that should be updated, last param defined the option that we want to pass data, here new is set to true means we'll return a new document
    updatedUser.name = 'Seriman';                           //we can't used this bcs we need to do update also
    await updatedUser.save();*/
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { //req.user.id access through setting authentication bearer token on postman means id value is coming from protected middlw route
      new: true,        // filteredBody here is data that should be updated(n we want here to update only name n email), last param defined the option that we want to pass data, here new is set to true means we'll return a new document
      runValidators: true //will check (catch error) for validators
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

// deleting middw n we'll not delete the user from the database but as long as the user is no longer accessible anywhere then it's still to use http method here like delete method
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false }); //we need protected route here to have id value for that we should set Authentication on postan to pass data from that middw to deleteMe midddw here

    res.status(204).json({ //204 is for deleting status code
        status: 'success',
        data: null  //no data to return to user after deleting action
    });
});

//exports.getUser = catchAsync(async(req, res, next) => {
    //500 status code means internal server error 
    /*res.status(500).json({ 
        status: 'error',
        message: 'This route is not yet defined!'
     });*/
//}); //replaces by generalize function from handlerFactory.js class as below
exports.getUser = factory.getOne(User); //we passed User as it concern User doc here


//we don't do for function handlerFactory class for createUser here
exports.createUser = catchAsync(async(req, res, next) => {
    //500 status code means internal server error 
    const newUser = await User.create(req.body); //req.body is the data that come with the post req
    
    res.status(201).json({
        status:'success',
        data:{
            user:newUser
        }
    });
    //checkable
    res.status(500).json({ 
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
     });
} );   

/*exports.updateUser = catchAsync(async(req, res, next) => {
    //500 status code means internal server error */
    /*res.status(500).json({ 
        status: 'error',
        message: 'This route is not yet defined!'
     });*/
//}); //replaces by generalize function from handlerFactory.js class as below
//DO NOT UPDATE USER PASSWORD WITH THIS HERE
exports.updateUser = factory.updateOne(User); //we passed User as it concern User doc here

/*exports.deleteUser = catchAsync(async(req, res, next) => {
    //500 status code means internal server error */
    /*res.status(500).json({ 
        status: 'error',
        message: 'This route is not yet defined!'
     });*/
//}); //replaces by generalize function from handlerFactory.js class as below
exports.deleteUser = factory.deleteOne(User); //we passed User as it concern User doc here

//the json web token should be stored in a secure HTTP-only cookies means we should have to send the token 
// not as simple string for json response but send token as a cookie so browser can then save it in the more secure way