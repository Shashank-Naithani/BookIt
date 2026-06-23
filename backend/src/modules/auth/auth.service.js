import bcrypt from "bcrypt";
import ApiError from "../../shared/errors/ApiError.js";
import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import { generateToken } from "../../shared/utils/jwt.js";
import { findUserByEmail, createUser } from "./auth.repository.js";

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new ApiError(
      409,
      RESPONSE_CODES.EMAIL_ALREADY_EXISTS,
      "Email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await createUser({
    ...userData,
    password: hashedPassword,
  });

  const { password, ...safeUser } = user;

  return safeUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      401,
      RESPONSE_CODES.INVALID_CREDENTIALS,
      "Invalid credentials",
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      RESPONSE_CODES.INVALID_CREDENTIALS,
      "Invalid credentials",
    );
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};
