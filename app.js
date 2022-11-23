const express = require('express');
//const fileupload = require('express-fileupload');

require("@babel/core").transformSync("code", {
  plugins: ["@babel/plugin-syntax-jsx"],
});

const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); //used for rate limiter package usage
const helmet = require('helmet'); //used to set security http headers n it's a package
const mongoSanitize = require('express-mongo-sanitize'); //for mongo sanitize package usage which is for nosql query injection attack prevention
const xss = require('xss-clean'); //for xss clean package usage which is for cross-site scripting attack prevention
const hpp = require('hpp'); //used for http parameter pollution package usage
//BUILD IN node Path module usage n it's used to manipulate the path name
const path = require('path'); //have to be installed
const cors = require('cors')
const cookieParser = require('cookie-parser'); //cookie-parser library is used to analyze all the cookies from the incoming request
const bodyParser = require('body-parser');


const AppError = require('./utils/appError'); //used of central class of error handling
const globalErrorHandler = require('./controllers/errorController'); //for central middleware error handler
const tourRouter = require('./routes/tourRoutes'); //import tourRoutes.js
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

//app.use(fileupload());

const app = express(); //using express functionality

app.use(cors());

//setting the view engine here pug engine
app.set('view engine', 'pug'); //it's automatically support by express so we need to install that library, n do not do require() for using it
//define where these views are located in our file system n the pug template is called views in express that's bcs
//these template are in fact the views in the model view controller architecture
app.set('views', path.join(__dirname, 'views')); //1st param file name we want use  n 2nd param will create a path joining the directory name /views 
//And path.join() is used for us bcs we don't know whether the path coming from user contain slash or not

app.use(bodyParser.urlencoded({ extended: true })); //

//app.use(bodyParser.json());
app.use(bodyParser.json({
  type: ["application/x-www-form-urlencoded", "application/json"], // Support json encoded bodies
}));

// 1) GLOBAL MIDDLEWARES

// Serving static files
//Adding static file through middleware below code line
//app.use(express.static(`${__dirname}/public`));
//doing build-in path usage
app.use(express.static(path.join(__dirname, 'public')));


// Set security HTTP headers: for testing we can see output from postman HEADERS option
//http header setting: for that we'll used another npm package called helmet n it's a kind of a standard in a express 
//development n it monstly used for express developer to set some additional feature to express bcs by default express don't have those functionality
//we should install it first
//app.use(helmet()); //used for helmet global middleware usage n it should be place on top of other middw like here
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
  next(); //res.header('Authorization', token)
});*/

//In order to use the config.env elt in our app follow the below code
//console.log(process.env.NODE_ENV);
//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //dev stand for development n morgan logging middleware usage after importing through require n gives info about req coming from user n it has #t value like dev tiny...
}

//Rate limiter implementation: it preventing same ip for making too(so) many requests to our API n that will help us preventing attacks like DoS(denied of service), brute force attacks 
//Rate limiter is implemented as a global middw function n his role is basically to count the nber of requests coming from one IP n then when there are too many request, block these requests
//the Rate limiter we're going to use is an npm package called Express Rate Limiter n we'll implement that global middw in app.js

// Limit requests from same API: for testing we can see output from postman HEADERS option
const limiter = rateLimit({
  max: 100, //we want 100 requests as maxim request by windowTime which one is in millisecond n here 1 hour
  windowMs: 60 * 60 * 1000, // nber of time 100 request is allowed here 1 hour n it's in millisecond n windowMs is also called the timestamp of the request
  message: 'Too many requests from this IP, please try again in an hour!' //error message when the limit is crossed
});
app.use('/api', limiter); // will passed rateLimit function to the global app middw n here /api means it will affect all the route starting by /api  

// Body parser, reading data from body into req.body
//Limitting the amount of data that comes in the body
//app.use(morgan('dev')) //dev stand for development n morgan logging middleware usage after importing through require n gives info about req coming from user n it has #t value like dev tiny...
//app.use(express.json()); //express.json() is a middleware used to modify the incoming data, without middleware we can't intermediate with incoming req so means no post req n used to parse data from the body
app.use(express.json({ limit: '10kb' })); //body limit data is 10 kilobytes here means size of return body data to user is 10kb n when we've a body larger than 10kb that will not be accepted
//cookie-parser library is used to analyze all the cookies from the incoming request
app.use(cookieParser()); //used to parse data from the cookie

//used for receiving the data coming from form n the way that the form send data to the server is called URL encoded.
//And we need below middw to basically parse that data coming from url encoded form data: called traditional way implementation
app.use(express.urlencoded({extended: true, limit: '10kb'})); //extended: true will allowed us to parse some more complex data 

//2 more package used to improve our application security n this time used to performe data sanitization means to clean all the data that comes into application from malicious code it's code 
//that is trying to attack our application n in this case we're trying to defend against two attacks(cross site scripting n NoSQL query injection)
//the 2 package are: express-mongo-sanitize n xss-clean n xss(cross-site scripting) n they should be installed first then used

// Data sanitization against NoSQL query injection exple: from postman log route body: {email:{"$gt": ""}, password:"pass1234"} so here without knowning the email we're able to log in the 
//application n it's n exple of nosql query injestion  
app.use(mongoSanitize()); //will return a middw function which we can then use n will prevent us for nosql query injection attack

// Data sanitization against XSS(cross site scripting) exple of xss attack: from postman signup route body:{"name": "<div id='body-code'>None</div>","email": "tester@natours.io",
//"password": "pass1234","passwordConfirm": "pass1234","role": "guide"} n after applying this security to our app we'll get output 
//as {"name": "&lt;div id='body-code'>None&lt;/div>"}
app.use(xss()); //will prevent us for some malicious html code

//parameter pollution usage: for this problem we'll used hpp package which stand for Http Parameter Pollution n to use it we should first install it
// Prevent parameter pollution used to clear out the query string (the one coming from user) n the problem is sending something in route different to string where we're expecting string
//{{URL}}api/v1/tours?sort=duration&sort=-price the query not allowed without preventing parameter pollution bcs it outputs an array n not a string
app.use(
  hpp({
    //whitelist is simply an array of properties for which we actually allow duplicates in the query string like {{URL}}api/v1/tours?duration=5&duration=7 n without whitelist we can't do that query 
    //n will return error as this.queryString.sort.split is not a function
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]// the listed field here are allowed for whitelist use purposes only
  })
);

/*//middleware usages
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});*/

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  //jwt token catching from coming req header 
  //console.log(req.headers); //req.header will return the header detail of coming request
  //to get a jwt authentication header of coming request we should set Authorization as value for Header KEY field from postman for coming req n set Bearer as starter value for Header VALUE field

  next();
});

//console.log(x);

// 3) ROUTES

//Route to access the created template 
/*app.get('/', (req, res)=>{
  //res.status(200).json() //here with template we'll go for render()
  res.status(200).render('base', {
   //here permit to pass variable to our template
   tour: 'The Forest Hiker',
   user: 'Jonas' 
  }); //base here is view file or template file n render() will go to the views folder n return with the file base.pug n here don't nee to specify pug n the access route is '/'
})*/

//we've to follow mvc model n for that we'll create a new file routes folder for route handling
//app.get('/overview', (req, res)=>{
//Mounting view route into the application
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter); //mount a router with path
app.use('/api/v1/bookings', bookingRouter);


//route handler(route that is not handle before) through debugger when route is not defined
//it's better to present this part of code at the bottom in order to avoid the inclusion of every request at the begining 
app.all('*', (req, res, next) => { //all() represent all the http request either get() or post() .....
  /*res.status(404).json({
    status: 'fail',
    message: `can't find ${req.originalUrl} on this server!`, // req.originalUrl return original url of the request
});*/
//above comment comes when we're using central middleware application's error handler
//new object of error to pass info of error
/*const err = new Error(`can't find ${req.originalUrl} on this server!`); //this msg here equal to err.message property means err.message will be replace by the msg
err.status = 'fail';
err.statusCode = 404;
//this block of code has to be replace by the central error class which is appError.js
*/

//the error message here will be passed as argument to the next() n express will automatically knows that it was an error and will called the global error handler"middleware" 
next(new AppError(`can't find ${req.originalUrl} on this server!`, '404'));
}); 

//handling all application's errors on one central middleware
app.use(globalErrorHandler);

//4) START SERVER
//this part is manage on server.js

module.exports = app;


//"watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
//"build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"

// npm run watch:js used to run bundle