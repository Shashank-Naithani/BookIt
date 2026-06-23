import ApiError from "../shared/errors/ApiError.js";
import { verifyToken } from "../shared/utils/jwt.js";
import { RESPONSE_CODES } from "../shared/constants/responseCodes.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return next(
      new ApiError(401, RESPONSE_CODES.UNAUTHORIZED, "Authentication required"),
    );
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return next(
      new ApiError(
        401,
        RESPONSE_CODES.UNAUTHORIZED,
        "Invalid or expired token",
      ),
    );
  }
};

export default authMiddleware;
