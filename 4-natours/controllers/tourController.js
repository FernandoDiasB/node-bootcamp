const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
         // 1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) Advanced Filtering

        let queryStr = JSON.stringify(queryObj);
        queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        this.query.find(JSON.parse(queryStr));

        return this;
    } 

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // default sort by order of creation
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // exclude __v field
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1; // convert to number
        const limit = this.queryString.limit * 1 || 100; // convert to number
        const skip = (page - 1) * limit; // calculate the number of documents to skip
        this.query = this.query.skip(skip).limit(limit);

        if (this.queryString.page) {
            const numTours = Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        return this;
    }
}

exports.getAllTours = async (req, res) => {

    try {

        // // 1) Filtering
        // const queryObj = { ...req.query };
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // excludedFields.forEach(el => delete queryObj[el]);

        // // 2) Advanced Filtering

        // let queryStr = JSON.stringify(queryObj);
        // queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));
        
        // let query = Tour.find(JSON.parse(queryStr));

        // 3) Sorting

        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     console.log(sortBy);
        //     query = query.sort(sortBy);
        //     // sort('price ratingsAverage')
        // }else {
        //     query = query.sort('-createdAt'); // defaualt sort by order of creation
        // }

        // 4) Field Limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // }else {
        //     query = query.select('-__v'); // exclude __v field
        // }

        // 5) Pagination
        // const page = req.query.page * 1 || 1; // convert to number
        // const limit = req.query.limit * 1 || 100; // convert to number
        // const skip = (page - 1) * limit; // calculate the number of documents to skip
        // query = query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('This page does not exist');
        // }



        // execute the query
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const tours = await features.query;

        // send response
        res.status(200).json({
            status: 'success',
            requestefAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
};
exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }

};
exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }


};
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the updated document
            runValidators: true // validate the data against the schema
        })

        res.status(200).json({
            status: 'sucess',
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.deleteTour = (req, res) => {

};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'sucess',
            data: null
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
}