
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
         // 1) Filtering
        const queryObj = { ...this.queryString };
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

module.exports = APIFeatures;