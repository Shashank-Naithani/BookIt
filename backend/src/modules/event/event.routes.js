import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getOrganizerEvents,
  updateEvent,
} from "./event.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";
import {
  createEventSchema,
  getEventsSchema,
  updateEventSchema,
} from "./event.validation.js";
import optionalAuth from "../../middlewares/optionalAuth.middleware.js";

const router = Router();

router.post(
  "/organizer",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(createEventSchema),
  createEvent,
);

router.get(
  "/organizer",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  getOrganizerEvents,
);

router.patch(
  "/organizer/:id",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(updateEventSchema),
  updateEvent,
);

router.get("/", validateMiddleware(getEventsSchema, "query"), getEvents);

router.get("/:id", optionalAuth, getEventById);
export default router;
