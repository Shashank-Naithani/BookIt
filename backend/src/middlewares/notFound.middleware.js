import ApiError from "../shared/errors/ApiError.js";

const notFoundMiddleware = (req, res, next) => {
    next(
        new ApiError(
            404,
            "ROUTE_NOT_FOUND",
            `Cannot ${req.method} ${req.originalUrl}`
        )
    );
};

export default notFoundMiddleware;