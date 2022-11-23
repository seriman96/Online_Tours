//const fs = require('fs');
const Tour = require('./../models/tourModel'); //importing the tour models from tourModel.js file as we're MVC
//const APIFeatures = require('./../utils/apiFeatures'); //for class usages
const catchAsync = require('./../utils/catchAsync'); //for catchAsync.js class usages
//const AppError = require('./../utils/appError'); //for central class error usage
const factory = require('./handlerFactory'); // generalize function of specific crud function for our model
const multer = require('multer'); //form-data format used for file or img uploading
const sharp = require('sharp');

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

exports.uploadTourImages = upload.fields([ // fields() allowed us to upload image from more fields  n here fields images n imageCover but max-numb to upload for imagecover is 1 n for images is 3
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 3}
]); //we can also do like 
//upload.array('images', 5); //when we've only 1 field array n 5 is maxim count: it's for multiple img coming from one field
//upload.single()  //req.file
//with upload.fields() we've req.files same for upload.array()
exports.resizeTourImages = catchAsync(async (req, res, next) =>{
    console.log(`welcome: ${req.files}`);

    if (!req.files.imageCover || !req.files.images) return next();
    //1. Get imageCover field
    //const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    if(!req.params.id) req.params.id = 0;
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`; // file naming n will add that field to the updated body
    //console.log(req.body.imageCover);
    await sharp(req.files.imageCover[0].buffer) // req.files.imageCover[0] means we'll focused on field imageCover 1st value means 1st img
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/tours/${req.body.imageCover}`);
    //req.body.imageCover = imageCoverFilename; //will add that field to the updated body

    //2. Get images field which is array of image
    req.body.images = [];
    //map() is used basically to save the three promises(nber of img here) which r the result of the 3 async funct we've below so we can await all promises after map operation done
    await Promise.all(req.files.images.map(async (file, i) =>{ //foreach(async (file, i) =>{ //with this one foreach the code won't go to next() so the solution is go with map which will await all promises of callfunct
        if(!req.params.id) req.params.id = 0;
        const filemane = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`; //naming file with tourid + timestamp(currentTime_id) + index+1 as it start to 0.
        await sharp(file.buffer) // req.files.images[i] means we'll focused on field images reading by index
            .resize(2000,1333)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/img/tours/${filemane}`);
        req.body.images.push(filemane); //push is like append() in python

    })
    ); //this promise will await this callback funct here

    next();
}) ; 

//implemented route to be exported here for middleware implementation in order to manage limit n sort param with coming req
exports.aliasTopTours = (req, res, next) =>{
    //127.0.0.1:8000/api/v1/tours?limit=5&sort=-ratingsAverage,price
    req.query.limit = '5';                      //everything comes like string here
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,guides,imageCover,startDates';  //in order to specify some fields, these r the permited fields here
    next();
};  

//Refractoring "organizing" API feature with the help of class usages
// class to be imported from utils.apiFeatures.js n use here


//const tours =JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));//JSON.parse() convert json object to js object

/*
//param middleware used here to avoid  DRY that happened in the below method 
exports.checkID = (req, res, next, val)=>{
    console.log(`Tour id is: ${val}`);
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    next();
}*/

//create a checkBody middleware 
//check if body contains the name n price property
//if not, send back 400(bad request)
//Add it to the post handler stack to do that we'll do router.post(middleware, tourController.createTours);

/*exports.checkBody = (req, res, next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
        
    } 
    next();
}*/

//2) ROUTE HANDLERS

//Organizing code by passing a callback function to a variable n this variable will take at the place of callback function

//retreiving data
/*exports.getAllTours = catchAsync(async (req,res, next)=>{ //next param is used in order to pass the error into it so that that error can be handle into a global error handler.
    //console.log(req.requestTime);

    //try {  try/cacth replace by catchAsync()
    //Executing Query
    const features = new APIFeatures(Tour.find(), req.query) //used to run the code of our APIFeatures class functionality
    .filter()
    .sort()
    .limitFields()
    .paginate(); 
    const tours = await features.query; //will fire the following method query.sort().select().skip().limit()

    //Send Response
    res.status(200).json({
        status:'success',
        //requestAt: req.requestTime,
        result: tours.length,
        data:{
            //tours:tours //if it's like that means key n value have same name we can keep only one(means take only key or value) in ec6
            tours
        }
    })*/
    /*} catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }*/
    
    //});  //replaces by generalize function from handlerFactory.js class as below
exports.getAllTours = factory.getAll(Tour); //we passed Tour as it concern tour doc here


    //accessing a specific data means send with specific id
/*exports.getTours = catchAsync(async (req,res, next)=>{ //id can be any variable name
    //console.log(req.params); //used to have info about the parameter we're passing on url like :id
    //try { try/cacth replace by catchAsync()
    //const tour = await Tour.findById(req.params.id); // Tour.findById(req.params.id) same as Tour.findOne({_id:req.params.id}) it's a short form of that
    //const tour = await Tour.findById(req.params.id).populate('guides'); //used to apply populate notion to the field guides in this query here n this method populate() will fill up the guides field with actual data(means replace the only user object_id with user actual data) else it will contain only contain object id.
    //instead of passing a string to population(), we can pass an object
    /*const tour = await Tour.findById(req.params.id).populate({ //n this populate function is an absolutely fundamental tool for working with data in Mongoose n specifically when there're relationships between data
        path: 'guides', //field where populate function to be applied
        select: '-__v -passwordChangedAt' //used here with sign (-) means to get rid of showing those given field here from output
    });//in order to apply it with more query we should implement on top of a query middleware from tourModel class
    */
    //virtual populate test of reviews docs from tour docs here 
   /* const tour = await Tour.findById(req.params.id).populate('reviews');

    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!tour){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    })*/
    /*} catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }*/
    
   // }); //replaces by generalize function from handlerFactory.js class as below
exports.getTours = factory.getOne(Tour, {path: 'reviews'}); //we passed Tour as it concern tour doc here n {path: 'reviews'} is used to apply populate 
//on top tour doc via review(fetch review data being in tour docs via virtual populate here) n it's possible to specify select parameter on it as {path: 'reviews', select:''}


//catching async(asynchronize) error
//to be imported from utils.catchAsync classes n 
//this part of code will replace the try/catch block in the creating data method below
    //Creating data
/*exports.createTours = catchAsync(async (req,res, next) =>{ //next param is used in order to pass the error into it so that that error can be handle into a global error handler.
    
    //creating a tour object
    //const newTour = new Tour({});
    //newTour.save();

    //simple way to create a tour object
    const newTour = await Tour.create(req.body); //req.body is the data that come with the post req
    
    res.status(201).json({
        status:'success',
        data:{
            tour:newTour
        }
    });*/
    
    /*try {
         
    } catch (err) {
        res.status(400).json({ //status code for bad request
            status: 'fail',
            message: err //or either this msg 'Invalid data send'
        });
    }*/
    
//}); //replaces by generalize function from handlerFactory.js class as below
exports.createTours = factory.createOne(Tour); //we passed Tour as it concern tour doc here


//updating data
/*exports.updateTours = catchAsync(async (req,res, next)=>{

    //DRY here to be delete n replace by exports.checkID

    //try {  //try/cacth replace by catchAsync()
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,//means new updated doc will be returned
        runValidators:true, //if true, run validators on this command n validate the update operation against model's schema
        //runValidators:false,
    });

    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!tour){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    }) */
    /*} catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }*/

    
   // }); //replaces by generalize function from handlerFactory.js class as below
   exports.updateTours = factory.updateOne(Tour); //we passed Tour as it concern tour doc here

    //deleting data
/*exports.deleteTours = catchAsync(async (req,res, next)=>{
//the below block of code(the comment block) is repeating  with the above method so that is DRY in order to avoid that it should be replace by param middleware
    
    //try { //try/cacth replace by catchAsync()
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ //204 means there is no content
        status:'success',
        data: null //it's a common pratice to not send a data to a user when deleting operation
    });

    //404 (not found error) handling recieved when we pass something that that's not exist
    if(!tour){ //null value in js is equal to false so means here if condition satisfy means not null
        return next(new AppError('No tour found with that ID', 404));
    }*/

    /*} catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        }); 
    }*/
    
    //}); //replaces by generalize function from handlerFactory.js class as below
exports.deleteTours = factory.deleteOne(Tour); //we passed Tour as it concern tour doc here

    //Aggregation pipeline matching n grouping
    //the statistic of Tour docs
    exports.getTourStats = catchAsync(async (req, res, next) =>{
        //try{ //try/cacth replace by catchAsync()
        const stats = await Tour.aggregate([
            {
            //match is used basically to select or filter certain document
            $match: {ratingsAverage:{$gte:4.5}} //it selects docs which have ratingsAverage >=4.5
            } , 
            {//for above req(doc selected) we'll apply grouping on it
                $group:{
                    //_id: null, //bcs we want the avg or statistic param for all tour docs
                    //_id: '$difficulty', //when we want statistic for specific field here difficulty field
                    //_id: '$ratingsAverage', // for ratingsAverage field
                    _id: { $toUpper: '$difficulty' }, //will upperCase difficulty field value when showing
                    numTours: {$sum: 1}, //total nber of docs bcs every doc will be sum up to 1 till end doc
                    numRatings: {$sum: '$ratingsQuantity'}, //nber of rating total
                    avgRating: {$avg: '$ratingsAverage' }, // $avg is mathematical average operator n $ratingsAverage is the field we want to find the average 
                    avgPrice: {$avg: '$price' },
                    minPrice: {$min: '$price' }, // $min is mathematical min operator
                    maxPrice: {$max: '$price' }, // $max is mathematical max operator
                }
            }, 
            {
            $sort:{ avgPrice: 1 } //will sort in ascending order of output of our grouping operation
            },
            /*{
            $match: { _id: {$ne: 'EASY'} } //this aggrega req here is like HAVING req in sql n it's used to select in the result of above gouping the docs not equal to EASY means to exclude EASY docs 
            },*/
        ]);
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        });  

        /*}catch(err){
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }*/
    });

    //Aggregation pipeline with unwinding(it's basically deconstruct an array field from the input 
    //document n output one doc for each elt of the array) notion which is to group data by recorded date or something like that
    exports.getMontlyPlan = catchAsync(async (req, res, next) =>{
        //try { //try/cacth replace by catchAsync()
            const year = req.params.year*1;//request parameter coming from url n get converted
            
            const plan = await Tour.aggregate([
                {
                    $unwind: '$startDates'
                },
                {
                    $match: { //select from above req records output where date is between the below mention date
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        }
                    }
                },
                { //grouping above selected docs by month
                    $group:{
                        _id: {$month: '$startDates'}, //will extract the month from the startDates field date
                        //how many Tour nber we've in that particular month
                        numTourStart: { $sum: 1 }, //will sum up Tour one by one till to have total nber
                        //we want to have the name of the tour
                        tours: { $push: '$name'}, //will return the array of Tour name bcs we can have so many Tour by month
                    }
                },
                { //add field for better formatting the id field on group aggrega in order to show that id nber correspond to month
                    $addFields:{month: '$_id'}
                },
                { //now get rid of the id field on group aggrega to be done with project aggrega
                    $project:{
                        _id: 0 //extract id field from showing n value 1 is for showing
                    }
                },
                { //Sorting the output
                    $sort:{numTourStart: 1} //ascending order sorting by numTourStart n -1 is for the inverse
                },
                { //limiting the output here to 12
                    $limit: 12
                }
            ]);

            res.status(200).json({
                status:'success',
                data:{
                    plan
                }
            });  

        /*} catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });  
        }*/
    });

//Geospatial query used sometime to visualize or to know about the distance btw your actual location n where the tour is located
exports.getToursWithin = catchAsync(async (req, res, next) => {
    // /tours-within/:distance/center/:latlng/unit/:unit    //latlng is longitude n latitude variable n distance variable is used for radius(rayon) value n will allow user to defined the searching area radius 
    // /tours-within/233/center/34.111745,-118.113491/unit/mi
    // /tours-within?distance=233&center=34.111745,-118.113491&unit=mi  //latlng= 34.111745,-118.113491
    const {distance, latlng, unit} = req.params; //this techn is called restructuring n we're taking distance, latlng, unit value from coming request parameters
    const [lat, lng] = latlng.split(',') //separate latitude n longitude n will return n array of 2 elts
    
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; //if unit is coming as miles(mi) then converted into radians(radiant) by dist/3963.2 which is radius of the earth in miles
    //else means it's in km so converted value is dist/6378.1
    //radius of the earth is 3963.2 when distance measure is in miles n it's 6378.1 when in km
    if (!lat || !lng) {
        next(
          new AppError(
            'Please provide latitutr and longitude in the format lat,lng.',
            400
          )
        );
      }
    //console.log(distance, lat, lng, unit);
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } //$geoWithin used to find docs within a certain geometrie n $centerSphere is used to find a latlng which is a central or center sphere or actual location of visitor
     //and $centerSphere takes n array of the coordinates(long, lat) n of the radius.For lontutide n latutide value for $centerSphere always longitude should come first.And 2nd elt of $centerSphere is radius n in mongoose it value is in radians unit
    }); 
    //in order to be able to do just basic queries, we need to first attribute an index to the field where the geospatial data that we're searching for is stored.  
    //so in this case, we need to add an index to startLocation to be done on tourModel.js 
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });

});
//Geospatial Aggregate 
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    //distance Unit conversion 
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001; //if unit comes in miles(mi) assign this 0.000621371 to multiplier variable else 2nd value   
  
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitude and longitude in the format lat,lng.',
          400
        )
      );
    }
  //in order to do calculation we always use the aggregation pipeline here we want to calculate distance btw specify point n all the start point
  //n in aggregate() we passed in n array with all the stages of the aggregation pipeline that we want to define
  //For geospatial aggregation, there's only one single stage, n that's called geoNear, schematize as $geoNear
  //n it's always needs to be the first one in the pipeline means first stage.And it requires at least one of our field contains a geospatial index
  //here we've only one index field so if index field is more that one we need the key parameter in order to define the field 
  // that we want to use for calculation
  const distances = await Tour.aggregate([
      {
        $geoNear: { //it has 2 mandatory field near n distanceField
          near: { //near property is the point from which to calculate the distances.So all the distances will be calculated btw this point that we defined 
            //here and then all the start location.n we need to specify as a geojon file as defined below n default distance is in meter unit
            type: 'Point',
            coordinates: [lng * 1, lat * 1] //lng * 1 used here to convert the value of lng here into a number, same for lat
          },
          distanceField: 'distance', //it's the name of the field that will be created n where all the calculated distances will be stored n we've called here distance
          //defined distance into either km/miles as it comes by default in meters and distanceMultiplier field allows us to do that
          //distanceMultiplier:0.001, //means to divide by 1000 in order to have value in km 
          distanceMultiplier: multiplier
        }
      },
      {//we want to keep only below defined field(those with value 1) in projection(output) 
        $project: {
          distance: 1,
          name: 1
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    });
  });
