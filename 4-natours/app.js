const express = require('express');
const morgan = require('morgan');

const appError = require('./utils/appError');
const globalErrorHandler = require ('./controllers/errorController.js');
const toursRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware to log requests
console.log(process.env.NODE_ENV); // Log the current environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Use morgan for logging in development mode
}

app.use(morgan('dev')); // Use morgan for logging in development mode
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(`${__dirname}/public`)); // Serve static files from the public directory


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next(); // Call next() to pass control to the next middleware
});

// routes
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404)); // Pass an error to the next middleware
});

app.use(globalErrorHandler); // Global error handling middleware

module.exports = app;