//const stripe = require('stripe')('sk_test_51LucFXSD3Lo4oSeyCSToDu16D4CBgdFUn4ee7xQj8nd5FLdEwyPib6Qupznu2j6BMCrK3suyN0H1FwulhhWIMXtN00e0vaBV2i'); //process.env.STRIPE_SECRET_KEY   //used to return a stripe object that we can work with it n it seems process.env.STRIPE_SECRET_KEY is not working here
//const Stripe = require('stripe')
const stripe = require('stripe')('sk_test_51LHpCiSCB5NJWvoBQkTxHJDkJV12vX1gTKi56FdcQBvclW5OiRFFt2jMs9X9VrsCLpTCrG2QDe3cnvYiD1jBH3RP00ElMtRL5O'); //process.env.STRIPE_SECRET_KEY   //used to return a stripe object that we can work with it n it seems process.env.STRIPE_SECRET_KEY is not working here
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync'); //for catchAsync.js class usages 
const AppError = require('../utils/appError'); //for central class error usage
const factory = require('./handlerFactory');
//const stripe = Stripe('sk_test_51LHpTdSAQuXo2wkEcqaMHLSKAXrMpV0BlFxwT0QnNXzoI9ZFYlBqG118BEx1oDQx2tStbVEiN22MpAadMOisJm2E00E2UQAgSq');

//const stripe = Stripe('pk_test_51LucFXSD3Lo4oSeytvTm3UtBbo51XwqzjjzSgZi6ZXCgYQw6DJraTBdSr5gw6DT2y6W2NFLRrcDDUQ7vVYUb31y800rETw16bN');


//

//exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//    console.log("welcome!");
//});
//

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked course(tour)
    const tour = await Tour.findById(req.params.tourID);

    // 2) Create check out session n it will return a promise
    const session = await stripe.checkout.sessions.create({
        //following r the infos about the session itself
        payment_method_types: ['card'], //the array here can take so many method but here we returned only card which is for credit card
        //the url we're getting after credit card operation get successed
        success_url: `${req.protocol}://${req.get('host')}/?tours=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
        // url that users will go if they cancelled the current payment
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        //returning customer email
        customer_email: req.user.email, //accessible bcs of protect route
        //we'll returned client reference ID n it gonna to allow us to pass in some data about the session that we're currently creating
        //And it's importance bcs later once the purchase was successful we'll then get access to the session object again. N by then we wanna to create a new booking in our database
        client_reference_id: req.params.tourID,

        //specifying some detail about the product itself here tour(course) 
        //infos about the product that user is about to purchase.
        line_items: [
            {
                //these fields name here are coming from stripe so can't make for us here
                name: `${tour.name} Tours`, //Tours when we're in tour project
                description: tour.summary,
                //some real images generate by stripe when app get deployed but we'll do a simulation here
                images: [`http://127.0.0.1:8000/img/tours/${tour.imageCover}`], //we can more values
                //the amount of the product that has been purchased
                amount: tour.price * 100, //we multiply by 100 bcs we expect the price in cents
                //specify the currency
                currency: 'usd', //this one is for dollars n if we want euro currency it's eur, other .....
                //specify nber of return product here we'll return 1 product
                quantity: 1
            }
        ]
    });

    // 3) Create session as response
    res.status(200)
    .set(
        //'Access-Control-Allow-Origin https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com',
        'Content-Security-Policy',
        'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
      )
    .json({
        status:'success',
        session
    });  

});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    //This is only temporary, bcs it's unsecure: everyone can make bookings without paying
    const {tours, user, price} = req.query; //{cours, user}it's called structuring n req.query is the query string

    if(!tours && !user && !price) return next();
    await Booking.create({tours, user, price}); 

    // For security purposes in order to not received the sensitive data follow below
    res.redirect(req.originalUrl.split('?')[0]); //used to redirect the url(permit to create new url that takes urls coming from req.originalUrl.split('?')[0]) n req.originalUrl() is used to get the entire coming url means success_url here n splited by ? n pick only first part

});

//crud operation on the booking
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);