const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next)=>{
    // 1) Get tour data from collection
    const tours = await Tour.find();
    // 2)  Build template

    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tour: tours
    });
  });

  exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews n guides)
    //we used findById when we know id
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
      path: 'reviews',
      fields: 'review rating user' //those r concern fields to be projected here
    });

    if(!tour){
      return next(new AppError('There is no tour with that name. ', 404));//will pass to global error middw handler
    }

    // 2)  Build template

    // 3) Render that template using tour data from 1)
    res.status(200)
    .set(
      'Access-Control-Allow-Origin *',
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
      //'connect-src self'
    ) //set() used here to solve mapbox functionality to the app
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
  });


  //manage user
  exports.getUsr = async (req, res, next)=>{
    res.status(200).render('manageUser', {
      title: 'Manage users',
      //ud: user_data,
      //crs: course
    });
  }; 


  exports.top2tours = async (req, res, next)=>{
    
    //const user_data = await User.find({type:'ADMIN'});
    const course = await Tour.find();
    res.status(200).render('managecrs', {
      title: 'Find top-5 tours',
      //ud: user_data,
      tour: course
    });
  }; 

  exports.monthlytours = async (req, res, next)=>{
    
    //const user_data = await User.find({type:'ADMIN'});
    const course = await Tour.find();
    res.status(200).render('monthcrs', {
      title: 'Find Monthly tours',
      //ud: user_data,
      tour: course
    });
  };

  exports.toursstats = async (req, res, next)=>{
    
    //const user_data = await User.find({type:'ADMIN'});
    const course = await Tour.find();
    res.status(200).render('statscrs', {
      title: 'Find tours stats',
      //ud: user_data,
      tour: course
    });
  }; 

  exports.searchuser = async (req, res, next)=>{
    
    const user_data = await User.find({name:"Leo Gillespie"});
    //const course = await Tour.find();
    //console.log(user_data);
    //console.log(user_data[0].name);
    res.status(200).render('findusr', {
      title: 'Find user',
      //ud: user_data,
      usr: user_data
    });
  }; 

  exports.searchusers = async (req, res, next)=>{
    
    const user_data = await User.find({_id: req.params.id});
    //const course = await Tour.find();
    //console.log(user_data);
    //console.log(user_data[0].name);
    res.status(200).render('findusrs', {
      title: 'User Found',
      //ud: user_data,
      usr: user_data
    });
  };

  exports.Updsuser = async (req, res, next)=>{
    
    //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
    const course = await User.find({name:"Leo Gillespie"});
    res.status(200).render('updsusers', {
      title: 'Update Users',
      //ud: user_data,
      usr: course
    });
  }; 

  exports.deltusers = async (req, res, next)=>{
    
    //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
    const course = await User.find({name:"Leo Gillespie"});
    res.status(200).render('deltsusers', {
      title: 'Delete Users',
      //ud: user_data,
      usr: course
    });
  };

  exports.Updsusers = catchAsync(async (req, res, next)=>{
    //console.log('Updating User', req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name, //body.name n body.email are coming from form input name attrib
      role: req.body.role,
      email: req.body.email,
      photo: req.body.photo
    },
    {
      new: true, //will take update docs as result
      runValidators: true,
    });

    //console.log(updatedUser.photo);
    //After updating we want to come back to the same page but with updated data
    res.status(200).render('upduserData', {
      title: 'Updating User Data',
      crs: updatedUser,
    });
  });


    //cours manage
    exports.getCours = async (req, res, next)=>{
    
      const user_data = await User.find({$or: [{role:'guide'}, {role:'lead-guide'}] });
      //const course = await Tour.find();
      res.status(200).render('cours', {
        title: 'Manage tours',
        ud: user_data,
        //crs: course
      });
    };
  
    exports.getCour = async (req, res, next)=>{
      
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      const course = await Tour.find();
      res.status(200).render('topCours', {
        title: 'Top tours',
        //ud: user_data,
        tour: course
      });
    };
  
    exports.searchTours = async (req, res, next)=>{
      
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      const course = await Tour.find();
      res.status(200).render('topCourFilt', {
        title: 'Search tours',
        //ud: user_data,
        tour: course
      });
    };
  
    exports.updateTour = async (req, res, next)=>{
      
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      const course = await Tour.find();
      res.status(200).render('updCours', {
        title: 'update tours',
        //ud: user_data,
        tour: course
      });
    };
    
    exports.uploadTour = async (req, res, next)=>{
      
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      const course = await Tour.find();
      res.status(200).render('uploadCours', {
        title: 'uploading tours image',
        //ud: user_data,
        tour: course
      });
    };
  
    exports.uploadCrs = async (req, res, next)=>{
      
      const uploadedcrs = await Tour.findByIdAndUpdate(req.params.id, {
        imageCover: req.body.imageCover,
        images: req.body.images,
      },
      {
        new: true, //will take update docs as result
        runValidators: true,
      });
      //console.log(uploadedcrs.images);
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      //const course = await Tour.find();
      res.status(200).render('uploadCrs', {
        title: 'uploading tours image',
        up: uploadedcrs
        
      });
    };
  
    exports.deleteTour = async (req, res, next)=>{
      
      //const user_data = await User.find({$or : [{type:'TRAINER'}, {type:'ADMIN'}]});
      const course = await Tour.find();
      res.status(200).render('delCours', {
        title: 'delete tours',
        //ud: user_data,
        tour: course
      });
    };
  
    exports.updateTours = catchAsync(async (req, res, next)=>{
      //console.log('Updating User', req.body);req.params.id
      //console.log(req.params.id); 
      //console.log(req.body.ratingsAverage);
      const updatedcours = await Tour.findByIdAndUpdate(req.params.id, {
        name: req.body.name, //body.name n body.email are coming from form input name attrib
        duration: req.body.duration,
        maxGroupSize: req.body.maxGroupSize,
        difficulty: req.body.difficulty,
        ratingsAverage: req.body.ratingsAverage,
        ratingsQuantity: req.body.ratingsQuantity,
        price: req.body.price,
        priceDiscount: req.body.priceDiscount,
        summary: req.body.summary,
        description: req.body.description,
        imageCover: req.body.imageCover,
        images: req.body.images,
        startDates: req.body.startDates,
        //category: req.body.category,
        guides: req.body.guides,
      },
      {
        new: true, //will take update docs as result
        runValidators: true,
      });
  
      //console.log(updatedcours);
      const user_data = await User.find({$or: [{role:'guide'}, {role:'lead-guide'}] });
      //console.log(user_data);
  
      //After updating we want to come back to the same page but with updated data
      res.status(200).render('updateCours', {
        title: 'Updating tours',
        review: updatedcours,
        trs: updatedcours,
        crs: user_data
      });
    });
  
    exports.deleteTours = catchAsync(async (req, res, next)=>{
      //console.log('Updating User', req.body);req.params.id
      //console.log(req.params.id);
      const deleteCours = await Tour.findById(req.params.id);
  
      //console.log(deleteReview);
  
      //console.log(deleteCours);
      if(!deleteCours){
        return next(new AppError('There is no review with that id. ', 404));//will pass to global error middw handler
      }
      //const tours = await Tour.findById({_id: deleteCours.cours});
      //console.log(tours);
  
      //After updating we want to come back to the same page but with updated data
      res.status(200).render('deleteCours', {
        title: 'Deleting tours',
        review: deleteCours,
        trs: deleteCours
      });
    });


    exports.getSignUpForm = (req, res)=>{
    
      res.status(200).render('signUp', {
        title: 'Sign into your account',
        //signup: `welcome`,
      });
    };
  
    exports.getSignForm = (req, res)=>{
      
      res.status(200).render('signedIn', {
        title: 'You are signed into your account',
        //signup: `welcome`,
      });
    };

  exports.getLoginForm = (req, res)=>{
    
    res.status(200).render('login', {
      title: 'Log into our account',
    });
  };

  exports.forgotPasswordForm = (req, res, next)=>{ //
    
    res.status(200).render('forgotPass', {
      title: 'Reseting your forgotten password',
      //User: req.user
    });
    //next();
  };

  exports.resetPasswordForm = async (req, res)=>{
    //console.log(`Reset Token: ${req.params.token}`);
    //const user = await User.findOne({passwordResetToken: req.params.token});
    //console.log(user);
    //console.log(`our token: ${req.params.token}`);

    res.status(200).render('resetPasswprd', {
      title: 'Reset your account password',
      usr: req.params.token
    });
  };

  exports.getAccount = (req, res)=>{
    //To get n account page all we really need to do is to simply render that page.
    //we don't even need to query for the current user bcs that has been done in the protected route

    res.status(200).render('account', {
      title: 'Your account',
    });
  };


  exports.getMyTours = catchAsync(async (req, res, next)=>{
    // 1) Find all bookings
    const bookings = await Booking.find({user: req.user.id}); //will returned all the booking docs for the current user
    
    // 2) Find tours(course) with the returned IDs
    const tourIDs = bookings.map(el => el.tours); //return list of cours(tour) id
    const tours = await Tour.find({_id: { $in: tourIDs } }); //find tour(cours) which is included in the above tourIDs list

    res.status(200).render('overview1', {
      title: 'My Course',
      tour: tours,
    });
  });

  exports.getMyReviews = async (req, res, next)=>{
    // 1) Find all reviews
    //console.log(req.params.id);
    const reviews = await Review.find({user: req.params.id}); //will returned all the review under a particular user
    
    // 2) Find tours(course) with the returned IDs
    const tourIDs = reviews.map(el => el.tour); //return list of cours(tour) id
    const tours = await Tour.find({_id: { $in: tourIDs } }); //find tour(cours) which is included in the above tourIDs list
    res.status(200).render('reviews1', {
      title: 'My Reviews',
      tour: tours,
      rev: reviews
    });
  };


  //this techniq to update user with traditional method means form is weird bcs it's not well handling the error n it's difficult to be handled that's y we'll go with api implementation
  //
  exports.updateUserData = catchAsync(async (req, res, next)=>{
    //console.log('Updating User', req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name: req.body.name, //body.name n body.email are coming from form input name attrib
      email: req.body.email
    },
    {
      new: true, //will take update docs as result
      runValidators: true,
    });

    //After updating we want to come back to the same page but with updated data
    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser,
    });
  });

  exports.updateMyReviews = catchAsync(async (req, res, next)=>{
    //console.log('Updating User', req.body);req.params.id
    //console.log(req.params.id);
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, {
      review: req.body.review, //body.name n body.email are coming from form input name attrib
      rating: req.body.rating
    },
    {
      new: true, //will take update docs as result
      runValidators: true,
    });

    //console.log(updatedReview);
    const tours = await Tour.findById({_id: updatedReview.tour});
    //console.log(tours);

    //After updating we want to come back to the same page but with updated data
    res.status(200).render('updateReview', {
      title: 'Updating your review',
      review: updatedReview,
      trs: tours
    });
  });

  exports.deleteMyReviews = catchAsync(async (req, res, next)=>{
    //console.log('Updating User', req.body);req.params.id
    //console.log(req.params.id);
    const deleteReview = await Review.findById(req.params.id);

    //console.log(deleteReview);

    //console.log(updatedReview);
    if(!deleteReview){
      return next(new AppError('There is no review with that id. ', 404));//will pass to global error middw handler
    }
    const tours = await Tour.findById({_id: deleteReview.tour});
    //console.log(tours);

    //After updating we want to come back to the same page but with updated data
    res.status(200).render('deleteReview', {
      title: 'Deleting your review',
      review: deleteReview,
      trs: tours
    });
  });

exports.createMyReviews = catchAsync(async (req, res)=>{
  //To get n account page all we really need to do is to simply render that page.
  //we don't even need to query for the current user bcs that has been done in the protected route
  //if(!req.user) return next(new AppError('You are not login. Please login to complete process. ', 404));
  const tours = await Tour.findOne({_id: req.params.id});
  const u_id = req.user.id;
  
  //console.log(u_id);
  //console.log(tours.name);
  res.status(200).render('createReview', {
    title: 'Creating Review',
    trs: tours,
    u_id
  }); 
});