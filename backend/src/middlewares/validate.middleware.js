import ApiError from "../shared/errors/ApiError.js";

const validateMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
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

    if (source === "body") {
      req.body = value;
    } else if (source === "params") {
      req.params = value;
    } else {
      req.validatedQuery = value;
    }

    next();
  };
};

export default validateMiddleware;
