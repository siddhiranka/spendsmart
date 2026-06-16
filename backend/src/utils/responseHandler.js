// Response Utility
exports.successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

exports.errorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
