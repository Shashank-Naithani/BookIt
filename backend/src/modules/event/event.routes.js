import { Router } from "express";
import {
  createEvent,
  getOrganizerEvents,
  updateEvent,
} from "./event.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";
import { createEventSchema, updateEventSchema } from "./event.validation.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(createEventSchema),
  createEvent,
);

router.get("/", authMiddleware, authorize(ROLES.ORGANIZER), getOrganizerEvents);

router.patch(
  "/:id",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(updateEventSchema),
  updateEvent,
);
export default router;
