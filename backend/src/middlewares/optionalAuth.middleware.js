import { verifyToken } from "../shared/utils/jwt.js";

const optionalAuth = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch {
    // Ignore invalid token
  }

  next();
};

export default optionalAuth;
