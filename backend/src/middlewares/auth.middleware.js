import ApiError from "../shared/errors/ApiError.js";
import { verifyToken } from "../shared/utils/jwt.js";
import { RESPONSE_CODES } from "../shared/constants/responseCodes.js";
import { findUserById } from "../modules/auth/auth.repository.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return next(
      new ApiError(401, RESPONSE_CODES.UNAUTHORIZED, "Authentication required"),
    );
  }

  try {
    const decoded = verifyToken(token);

    const freshUser = await findUserById(decoded.userId);

    if (!freshUser) {
      return next(
        new ApiError(401, RESPONSE_CODES.UNAUTHORIZED, "User no longer exists"),
      );
    }

    req.user = {
      userId: freshUser.id,
      role: freshUser.role,
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
