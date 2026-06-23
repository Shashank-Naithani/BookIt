import { Router } from "express";

import { register, login, logout } from "./auth.controller.js";

import validateMiddleware from "../../middlewares/validate.middleware.js";

import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validateMiddleware(registerSchema), register);

router.post("/login", validateMiddleware(loginSchema), login);

router.post("/logout", logout);

export default router;
