module.exports = fn => { //so here fn become an async function which returns a promise n when there is an error that basically means a promise get rejected n 
    //that error can catch as below
    return (req, res, next) => { //next passes error on it n to be handle by global error
        fn(req, res, next).catch(next); //catch error n next will pass it to global err handler n next here is equal to err=>next(err)
    };
}; //this part of code will replace the try/catch block in the creating data method below 
