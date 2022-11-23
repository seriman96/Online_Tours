const fs = require('fs');
const mongoose = require('mongoose'); // used to establish connection btw app to mongodb through mongo driver
const dotenv = require('dotenv'); //used of config.env file
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' }); //accessing the config.env file Environment Variable
//console.log(app.get('env')); //show which type of environment variable we're
//console.log(process.env); //shows all the process under env variable

//creating connection with mongodb
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); //DB is connection string variable
//connection with the hosted database version
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    //useCreateIndex: true, //these 2 feature are not supported in mongoose@6
    //useFindAndModify: false
}).then(con => { //then() is here a promises used to fire after calling 
    //console.log(con.connections); //return all the info related to the connection
    console.log('DB connection successful!');
}).catch((err)=>{console.log('err',err.message)});

//Read JSON file
//importing development file
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const review = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

//Import js Data into Database

const importData = async () =>{
    try{
        await Tour.create(tours);
        await User.create(users, {validateBeforeSave: false}); //validateBeforeSave: false , used to disactive(skip) all validator before create opearation
        await Review.create(review);
        console.log('Data successfully loaded');
    }catch(err){
        console.log(err);
    }
    process.exit();//to exit from the process
}

//Delete All Data from DB
const deleteData = async () =>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();//to exit from the process
}

//interacting with console

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}

//console.log(process.argv); 
/*process.argv is used to access the param of process n we're 1st param which is node location 
2nd the file location we're working on n 3rd the operaton we want to do like import delete... */