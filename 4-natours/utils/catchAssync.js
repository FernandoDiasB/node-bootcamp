module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);  // if there is an error, it will be passed to next()
    };
};