import { findUserById } from "../modules/auth/auth.repository.js";
import { RESPONSE_CODES } from "../shared/constants/responseCodes.js";
import ApiError from "../shared/errors/ApiError.js";
import { verifyToken } from "../shared/utils/jwt.js";

const optionalAuth = async (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return next();
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
  } catch {
    // Ignore invalid token
  }

  next();
};

export default optionalAuth;
