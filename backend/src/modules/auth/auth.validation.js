import Joi from "joi";
import { ROLES } from "../../shared/constants/roles.js";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  email: Joi.string().trim().email().required(),

  password: Joi.string().min(6).max(50).required(),

  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),

  password: Joi.string().required(),
});
