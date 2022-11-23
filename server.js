const mongoose = require('mongoose'); // used to establish connection btw app to mongodb through mongo driver
//const SocketServer = require('ws').Server; 


//catching uncaught exceptions it's all bug that has occurred on async code n that has not been handle anymore
//this part of code should be placed on top  bcs when error raise before that method it can not take an account n this mothod is not happening in a async way
process.on('uncaughtException', err=>{ //this one, the on() is an event emiter
    console.log(err.name, err.message);
    //console.log(err);
    console.log('UNCAUGHT EXCEPTION!💥 Shutting down...');
    //stop the server running not required here bcs it's not coming in a async way
    process.exit(1); //code value either 0 or 1 n 0 is success n 1 unsuccess n used when we're leaving on the process or ending the process
    /*server.close(()=>{});*/ 
});

const app = require('./app');//used to import app.js file
const dotenv = require('dotenv'); //used of config.env file

dotenv.config({ path: './config.env' }); //accessing the config.env file Environment Variable
//console.log(app.get('env')); //show which type of environment variable we're
//console.log(process.env); //shows all the process under env variable

//creating connection with mongodb
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); //DB's connection string variable
//connection with the hosted database version
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    //useCreateIndex: true, //these 2 feature are not supported in mongoose@6
    //useFindAndModify: false
}).then(con => { //then() is here a promises used to fire after calling it
    //console.log(con.connections); //return all the info related to the connection
    console.log('DB connection successful!');
}).catch((err)=>{console.log('err',err.message)});

//connection with the local database version
/*mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    //useCreateIndex: true, //these 2 feature are supported in mongoose@6
    //useFindAndModify: false
}).then(con => {
    //console.log(con.connections); //return all the info related to the connection
    console.log('DB connection successful!');
}).catch((err)=>{console.log('err',err.message)});*/

//for building a model we should built a schema object
//will import from model file

//creating document with our model
/*const testTour = new Tour({
    //name: 'The forest Hiker',
    name: 'The Park Camper',
    //rating:4.7,
    price:997,
})*/

//store our document to the tour collection database
/*testTour.save().then(doc =>{
    console.log(doc);
}).catch(err =>{console.log('ERROR ❌: ', err)});*/

//now we've access to config.env n we'll use his parameter here
const port = process.env.PORT || 3000; //our app will run on 8000 or 3000
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});

//const wss = new SocketServer({ server });

//general promise handler for handling all the promises
//unhandle promise rejection means we've a rejection promise among our promises that is not handle n handle that
//this error is coming when we're database connexion problem
process.on('unhandledRejection', err=>{ //this one, the on() is an event emiter
console.log(err.name, err.message);
//console.log(err);
console.log('UNHANDLE REJECTION!💥 Shutting down...');
//stop the server running
server.close(()=>{
    process.exit(1); //code value either 0 or 1 n 0 is success n 1 unsuccess n used when we're leaving on the process or ending the process
});

}); 

//console.log(x);
