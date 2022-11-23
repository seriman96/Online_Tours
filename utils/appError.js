class AppError extends Error {
    constructor(message, statusCode){
        super(message); //error msg property to be passed to super class
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail': 'error'; //means if statusCode start with 4 then fail else error
        this.isOperational = true; // will assign our error to operational error type bcs w're 2 type of error operational n progamming n all the error that we create ourselve will be an operational error here
    
        Error.captureStackTrace(this, this.constructor); //when new object is created the constructor function is called from the stack trace 
    }
}
module.exports = AppError;