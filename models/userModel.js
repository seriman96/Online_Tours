const mongoose = require('mongoose'); // used to establish connection btw app to mongodb through mongo driver
const validator = require('validator'); //for validator lib usages it's a plugin for custom validator
const bcrypt = require('bcryptjs'); //browfish encryption techn
const crypto = require('crypto'); //built-in node module used for simple encryption

const userSchema = new mongoose.Schema({
    name:{ 
        type: String, 
        required: [true, 'Please tell us your name!'], 
    },
    email:{
        type: String,
        required:[true, 'Please provide your email'],
        unique: true,
        lowercase: true, //will lowercase this field value
        //validator for an email following that an email can be considered as valid
        validate:[validator.isEmail, 'Please provide a valid email'], //will check for an email purposes
    },
    photo: {
      type: String,
      default: 'default.jpg'
    }, //it is the path of the placed image
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'], //list of authorize group of people for doing this role
        default: 'user'  //if nothing select by user this will be default value
    }, 
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false, //used to disable this field in output

    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        //validator for confirmation if 2 password are equal
        validate: {
            //this only going to works for on save operation User.create() cmd = User.save
            validator: function(el){
                return el === this.password; //el here is a passwordConfirm
            },
            message: 'Passwords are not the same',
        }
    },
    passwordChangedAt: Date ,
    passwordResetToken: String,
    passwordResetExpires: Date, 
    active: { //any user that is created new is of course an active user n used for user deleting purposes(route: /deleteMe) means don't completely delete user but disactivate.
      type: Boolean,
      default: true, //newly created users default is active
      select: false // hidding the field to the user
    }  
});

//implementing encryption on password field in order to avoid his storing in database in a plain text with the help of mongoose middleware
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next(); //will check if the password has not been modified
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12); //used for avoiding the breadforce attack n 12 value here is called cost param n is a measure of how cpu intensive this operation will be n his default value is 10
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined; //used for avoiding this field to be persisted in the database
    next();
  });

  userSchema.pre('save', function(next) {
    //check is passwd has been modified or not n this.isNew will check if the document is new or not
    if (!this.isModified('password') || this.isNew) return next(); //used to take an acount of password resetting in order to change the value of field passwordChangedAt
  
    this.passwordChangedAt = Date.now() - 1000; //1000 here is 1_second n it's used bcs the token generation might take time in order to match them we're doing like that
    next();
  }); //we've commented these above part of code bcs all password in users.json file is encrypted here when we're importing users.json

  //implementing query middw in order to not show the current user data on output after middw deleting action
  userSchema.pre(/^find/, function(next) { //^ means here every query starting by find that query middw will be applied on it 
    // this query middw points to the current query means any query starting by find 
    this.find({ active: { $ne: false } }); //return users where active is not equal to false means true 
    next();
  });
  
  //instance method creation n that method is available for all the object n it's called in authController.js in order to compare both password
  //checking if current password is equal to saved password
  userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    //this.password; // won't be available here bcs password field get excluded from output 
    return await bcrypt.compare(candidatePassword, userPassword); //will do encryption of both password n compare the encrypted password n return true if equal else false 
  };
  // another instance method to Check if user changed password after the token was issued
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) { //JWTTimestamp is the token timestamp n say when the token get issued n by default we'll returned false by this method which means passw didn't get change after receiving token
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000, 10);//the keyword 'this' is always pointing to the current docs and getTime() is used to convert date into a time and 10 here is the base 10
  
      return JWTTimestamp < changedTimestamp; //means token issue time < pasword changed time n once false means passw has not been changed
    }
    /* Testing purpose
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
    }*/
  
    // False here means password have not been changed 
    return false;
  };

  //instance method for resetting password
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); //crypto random bytes generation here nber of byte is 32 n output is converted to hexa string n it's the one we're receiving to reset the password(like opt)
  
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); //used to encrypt the generated token 'resetToken' n encryption techn is sha 256 bit
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //password reset expired time here in millisecond here now +10*second(60)*1000(having it in millisecond)
  
    return resetToken;
  };  
//password of user for all this application is test1234

//creating model for our above schema object n we use to start a variable name with capital letter
const User = mongoose.model('User', userSchema); //model is like a class in js n model name is User

module.exports = User; //used to export the model
