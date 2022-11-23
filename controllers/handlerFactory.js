const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

////A factory function is a function that returns another function for us and in our case 
//here will be for deleting handler,updating,creating,and also for reading resources and 
//implemented in handlerFactory.js class

//in order to structure our code either to do Tour.findByIdAndDelete() for tour model, again review model and so on
// so that is some kind of duplication, in order to avoid that we'll pass it directly the model means it will take model
//it will take model from argument based on the model pass it to him on argument will be executed and that will well structure 
//our code. implemented as below n it called the generation of the specific function we've done just before 


exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

//popOptions here stand for populate option used to apply populate on top of our request from this middw here
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //we'll make a query here to check if there a query which come with populate to handle that query
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions); //if there is populate option change our default query to query with populate
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //const doc = await features.query.explain(); //will explain about query statistic n we'll implement indexing technique on top of the query, to optmize searching output
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

