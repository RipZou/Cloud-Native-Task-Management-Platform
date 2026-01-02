const errorHandler = (err, req, res, next) => {
    const statusCode = err.isOperational ? err.statusCode : 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';

    console.error(`[${req.requestId}]`, err);

    res.status(statusCode).json({
        requestId: req.requestId,
        error: message,
    });
}

module.exports = errorHandler;