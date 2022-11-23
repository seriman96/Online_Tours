const {promisify} = require('util'); //for utilities module importation n used here for promisify() usage which is a method that return response using callback funct to return resp in a promise object
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken'); //used for json web token authentication purposes n it's a library
const catchAsync = require('./../utils/catchAsync'); //for catchAsync.js class usages
const AppError = require('./../utils/appError'); //for central error classes usage
//const sendEmail = require('./../utils/email'); //used email.js classes usage defined in utils folder
const Email = require('./../utils/email'); //used email.js classes usage defined in utils folder
const crypto = require('crypto'); //used for encryption purpose


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { //for (jwt) json web token authentification purpose
    expiresIn: process.env.JWT_EXPIRES_IN
  }); //1st param is a payload n 2nd param is the secret key n third param is the period of jwt n used to jwt token for user signUp
};

//the json web token should be stored in a secure HTTP-only cookies means we should have to send the token 
// not as simple string for json response but send token as a cookie so browser can then save it in the more secure way

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure:true, replace by cookieOptions.secure = true in bellow if condition, when it's is satisfied
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //when we're in production the cookie option is set to true will allowed cookie communication on https n will replace secure:true from cookies configuration

 /* res.cookie('jwt', token,{ //here jwt is the name of cookie variable n token the value of cookie n the last param is called cookie option n used for some cookie setting n in order to allow or grant 
    //https communication or secure attrib from cookie option we'll make cookie option in a seperate variable called here cookieOptions
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), //cookie expired time here now + 90days converted to millisecond
    //secure:true, //the cookie will be send into a secure connection means under https protocole
    httpOnly: true //means cookie cannot be accessed or modified in any way by the browser n it prevents the cross-site scrypting attacks
  }
  );*/
  res.cookie('jwt', token, cookieOptions); //these're cookie name,value n options

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

//logout handler
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({status: 'success'});
};


//Rate limiter implementation: it preventing same ip for making too(so) many requests to our API n that will help us preventing attacks like DoS(denied of service), brute force attacks 
//Rate limiter is implemented as a global middw function n his role is basically to count the nber of requests coming from one IP n then when there are too many request, block these requests
//the Rate limiter we're going to use is an npm package called Express Rate Limiter n we'll implement that global middw in app.js
exports.signup = catchAsync(async(req, res, next) => {
    //500 status code means internal server error 
    /*const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt : req.body.passwordChangedAt,
        role: req.body.role,
      });*/ //req.body is the data that come with the post req

    const newUser = await User.create(req.body);
    
    //sending email to user for the successfull registration
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/me`; //${req.protocol}://${req.get('host')}/me returned http://127.0.0.1:8000/me and {req.protocol} used to access the protocol used by the req n req.get('host') replace 127.0.0.1:8000 
    console.log(url);
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);

    /*const token = jwt.sign({id: newUser.__id}, process.env.JWT_SECRET, {  //for (jwt) json web token authentification purpose
        expiresIn: process.env.JWT_EXPIRES_IN
    });  //1st param is a payload n 2nd param is the secret key n third param is the period of jwt n used to jwt token for user signUp
      to be replace by the signToken()*/
    /*const token = signToken(newUser.__id);

    res.status(201).json({
        status:'success',
        token, //will send the token generated through jwt to the client
        data:{
            user:newUser
        }
    });*/ //replace by createSendToken() method
    
} );  

exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body; //data coming from login
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); //password field was excluded from output in model in order to show it from output or included we'll do select as here
  
  /*
  const correct = user.correctPassword(password, user.password); //password, user.password are respectively candidate n user password
  //if(!user || !correct)   if user does not exist this part of code won't be executed so to fix it as mention below*/
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token(jwt) to client

  createSendToken(user, 200, res);

  /*const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });*/ //replace by createSendToken() method
  });

  //protected routes: we'll create middleware function for that n it's first execute before route middleware
  exports.protect = catchAsync(async (req, res, next) => {
    //authentification for security purposes handlers
    // 1) Getting token and check of it's there
    let token;
    //if condition is reading token from postman authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { //req.headers.authorization used for json (jwt) token header reception sets in postman header option: field KEY=authorization n field VALUE start with Bearer then header will be received
      token = req.headers.authorization.split(' ')[1]; //used to pick or capture the jwt token part from header coming req bcs it comes as 'Bearer rrrtttyyy(jwt token)'
    }else if(req.cookies.jwt){ //if there is no header authorization go for cookie token
      token = req.cookies.jwt;
    }
    //console.log(token);
  
    if (!token) { //check if token that's not exist
      return next( //will allow to go to global error handler middleware
        new AppError('You are not logged in! Please log in to get access.', 401) //401 is unauthorized error status code
      );
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //will convert or decode output of 2nd method here n will put in a promises object format n it's used to check if the token payload has not been modified or changed
    //jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);//if verification success will return id,creation_date,expire_date of user

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) { //if no current user raise the error
      return next(new AppError('The user belonging to this token does no longer exist.',401));
    }
    //console.log(currentUser);
    // 4) Check if user changed password after the token was issued :if yes we don't want user to access to protected route
    if (currentUser.changedPasswordAfter(decoded.iat)) { //if satisfied means passw get changed
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
    //currentUser.changedPasswordAfter(decoded.iat); // token iat=>initiated at or created at n will return the time of token creation
    
    // GRANT ACCESS TO PROTECTED ROUTE :Received after execution of above codes
    req.user = currentUser; //put entire user data on the request n req object is used to shift data from one middleware to another middleware
    res.locals.user = currentUser; //used for being available to all the template file
    //console.log(req.user);
    next();
  });

  //this middw is really only for rendered pages so the goal here is not to protect any route so there will never be an error in this middw
  //only for rendered pages, no errors!
  exports.isLoggedIn = async (req, res, next) => {
    // 1) Getting token and check of it's there
    if(req.cookies.jwt){ //getting token from cookie
      try{
        // 2) Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET); 
        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) { //if no current user raise the error
          return next();
        }
        //console.log(currentUser);
        // 4) Check if user changed password after the token was issued :if yes we don't want user to access to protected route
        if (currentUser.changedPasswordAfter(decoded.iat)) { //if satisfied means passw get changed
          return next();
        }
        //currentUser.changedPasswordAfter(decoded.iat); // token iat=>initiated at or created at n will return the time of token creation
        
        // THERE IS A LOGGED IN USER :Received after execution of above codes

        //making user accessible to our template
        res.locals.user = currentUser; //res.locals will permit to pug template to access the variable user here n it's like passing data into a template using rendering function

        //req.user = currentUser; //put entire user data on the request n req object is used to shift data from one middleware to another middleware
        //console.log(req.user);

        return next();
      }catch(err){
        return next();
      }
  }

  next(); //will run if there is no cookie
  };


  //authorization:it's verification for the role of user means if a certain user is allowed to access a certain resources event if it's log in
  //for that we'll implement another middleware this time used to restrict certain route access like delete tours...
  //usually we can not pass argument into a middw function but in this case we want to do, we want to pass a role who are allowed to access to the ressources
  //in this case this admin n lead-guide n to solve that we'll make it as a wrapper function which will then return the middlw function that we want to create
  exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) { //will check if the current user is not included in the roles array so raise error
        return next(
          new AppError('You do not have permission to perform this action', 403) //403 statut code means forbidden
        );
      }
  
      next();
    };
  };

  //resetting password done by 2 steps
  //the 1st one or step user sends a post request to a forgot password route, only with this email address n this will then create a reset token
  //and sent that to the email address that was provided. It's just a simple random token, not a json web token

  //2nd step the user then sends that token from his email along with a new password in order to update his password

  exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email(email envoye)
    const user = await User.findOne({ email: req.body.email }); 
   // console.log(user);
    if (!user) {
      return next(new AppError('There is no user with email address.', 404)); //404 not found status code
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); //validateBeforeSave set to false will deactivate all the validators that we specified in our schema before saving in the database

    // 3) Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`; //here protocole used can be http or https, n then we've host  n reset route
    
      //const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
      /*await User.updateOne(
        {email:user.email},
        {$set: {passwordResetToken: user.passwordResetToken, passwordResetExpires: user.passwordResetExpires}},
        {upsert: true});*/
        /*.then((result, err)=>{
          if(err){
            res.status(403);
      
          }else{
            res.status(200).json({data: result, message: 'Value Updated'});
          }
        });*/

        //email to be sent to the user for his resetting request
        /*await sendEmail({
          email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
          message
        }); replace by below code line*/
        await new Email(user, resetURL).sendPasswordReset();

        //response for the successful sent
        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!',
          data: resetToken
        });
    } catch (err) { //error catch when the passw reset time expired n so on 
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  });
  
  //Nodemailer: package for email handling n it should be first installed
  //email handler function creation with the help of Nodemailer package n the function is defined in class email.j from utils folder

  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    //crypto here is used to encrypt the incoming request paramaters which is token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex'); //digest= hex here is to convert output into hexadecimal
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }); //will find user by the token n that token should not been expired
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) { //if user does not exist
      return next(new AppError('Token is invalid or has expired', 400));
    }
    //else
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    //we'll delete passwd reset token n expire time when reset action get completed
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); //we won't deactivate the validator here bcs we want to if passwd = passwconfirm
  
    // 3) Update changedPasswordAt property for the user to be done on userModel class
    // 4) Log the user in, send JWT
    /*const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });*/ //replace by createSendToken() method
    createSendToken(user, 200, res);
  });

  //update passwd without forgetting passwd
  //bcs of security issue we always ask the current passwd before updating the password
  exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password'); //req.user.id is here the current userId the one coming from protected route select() here will add password field from the output bcs it gets removed from model
    //n for receiving user id here we should set on Authorization option from postman the bearer token n associate our jwt variable envir
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    } 
  
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    /*const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });*/ //replace by createSendToken() method
    createSendToken(user, 200, res);
  });

  //updating the currently authenticated user that one middleware might be implemented on userController
  