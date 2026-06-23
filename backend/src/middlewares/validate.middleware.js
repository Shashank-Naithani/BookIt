import ApiError from "../shared/errors/ApiError.js";

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          "Validation failed",
          error.details.map((detail) => detail.message),
        ),
      );
    }

    req.body = value;

    next();
  };
};

export default validateMiddleware;
