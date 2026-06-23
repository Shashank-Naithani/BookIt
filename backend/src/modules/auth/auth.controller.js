import { registerUser, loginUser } from "./auth.service.js";
import { findUserById } from "./auth.repository.js";

import asyncHandler from "../../shared/utils/asyncHandler.js";
import sendSuccessResponse from "../../shared/utils/sendSuccessResponse.js";

import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import { COOKIE_OPTIONS } from "../../shared/constants/cookieOptions.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  return sendSuccessResponse(
    res,
    201,
    RESPONSE_CODES.REGISTER_SUCCESS,
    "User registered successfully",
    user,
  );
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginUser(req.body);

  res.cookie("jwtToken", token, COOKIE_OPTIONS);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.LOGIN_SUCCESS,
    "Login successful",
    user,
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwtToken", COOKIE_OPTIONS);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.LOGOUT_SUCCESS,
    "Logout successful",
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.userId);

  const { password, ...safeUser } = user;

  return sendSuccessResponse(
    res,
    200,
    "CURRENT_USER_FETCHED",
    "Current user fetched successfully",
    safeUser,
  );
});
