class APIFeatures{
    //query, queryString :query is the value coming from mongoose means mongoose query n queryString is the one coming from express basically coming from the route
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    //creating one method for each of the functionality
    //1st Filtering or filter
    filter(){
        const queryObj = {...this.queryString}; //... is called structuring n it's es6  notation n it will take all the fields out the object n create or return new obj for us 
        const excludedFields = ['page', 'sort', 'limit', 'fields']; //list of elt to be excluded from the obj creation
        //127.0.0.1:8000/api/v1/tours?difficulty=easy&page=2&sort=1&limit=10  to be check from postman
        //Removing excluded fields from the object
        excludedFields.forEach(el => delete queryObj[el]);

        //console.log(req.query);

        //1 B) advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //used in order to fix this problem [duration={$gte:5} duration: { gte: '5' }] bcs we miss $ from req coming
        this.query = this.query.find(JSON.parse(queryStr));
        //let query = Tour.find(JSON.parse(queryStr)); //bad practice to tackle drectly with Tour model to be solve with above command line
        return this; //will return the entire object
    }
    //2nd Sorting or sort
    sort(){
        if(this.queryString.sort){//means if yes for sorting in req  n req: 127.0.0.1:8000/api/v1/tours?sort=price it's sorting with ascending order if we want descending order ?sort=-price
            //console.log(this.queryString.sort); //will return user passing value to route 
            //query = query.sort(req.query.sort); //one field sorting
            //sorting with multiple fields
            const sortBy = this.queryString.sort.split(',').join(' ');  //will sort multiple field separate by ','
            //sort('price ratingsAverage') //here we'll sort with field price n ratingAverage. Req 127.0.0.1:8000/api/v1/tours?sort=price,ratingAverage
            //console.log(sortBy);
            this.query = this.query.sort(sortBy); //this.query is equal to Tour.find()
        }else{
            this.query = this.query.sort('-createdAt'); //will sort by createdAt field descending order if nothing is given or passing in req as sorting param
        }
        return this; //will return the entire object
    }
    //3rd limitting fields or limit
    limitFields(){
        if(this.queryString.fields){ //127.0.0.1:8000/api/v1/tours?fields=name,duration,difficulty,price
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); //this is called projection, the selected fields
        }else{ //127.0.0.1:8000/api/v1/tours?fields=-name,-duration,difficulty,price //moins(-) here means to exclude the field like name n duration will be excluded here
            //query = query.select('name duration price'); //this one is including this 3 fields when showing
            this.query = this.query.select('-__v'); //means to exclude this field __v when showing to client
        }
        return this;
    }
    //4th pagination
    paginate(){
        const page = this.queryString.page*1 || 1; //req.query.page*1 will do conversion to a number
        const limit = this.queryString.limit*1 || 1; //will take converted value or 1
        const skip = (page - 1) * limit; //means we'll start from the value return by (page - 1) * limit
        //127.0.0.1:8000/api/v1/tours?page=2&limit=10 //limit 10 means we've 10 result for page1, 10 for page2,.... so we're 1-10=>page1, 11-20=>page2,....
        this.query = this.query.skip(skip).limit(limit);
        //condition when combination skip n limit override'depasse' documents number
        /*if(this.queryString.page){
            const numTours = await Tour.countDocuments(); //used to count the number of tour documents
            if(skip >= numTours) throw new Error('This page does not exist');
        } this block of code is useless here bcs of that commented*/
        return this;
    }
}
module.exports =APIFeatures;