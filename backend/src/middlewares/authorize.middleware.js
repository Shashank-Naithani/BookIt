import ApiError from "../shared/errors/ApiError.js";
import { RESPONSE_CODES } from "../shared/constants/responseCodes.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, RESPONSE_CODES.FORBIDDEN, "Access denied"));
    }

    next();
  };
};

export default authorize;
