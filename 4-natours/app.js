const express = require('express');
const morgan = require('morgan');

const toursRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware to log requests

app.use(morgan('dev')); // Use morgan for logging in development mode

app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next(); // Call next() to pass control to the next middleware
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next(); // Call next() to pass control to the next middleware
});


// route handlers

// routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;