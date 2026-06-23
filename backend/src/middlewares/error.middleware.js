const errorMiddleware = (
    error,
    req,
    res,
    next
) => {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message || "Something went wrong",
        errors: null,
    });
};

export default errorMiddleware;