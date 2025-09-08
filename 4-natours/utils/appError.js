class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent class constructor
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Mark this error as operational

        Error.captureStackTrace(this, this.constructor); // Capture the stack trace

    }
}

module.exports = AppError;