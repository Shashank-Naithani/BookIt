import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  getEventAttendees,
  getEventAnalytics,
} from "./event.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";
import {
  createEventSchema,
  eventIdSchema,
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

router.delete(
  "/organizer/:id",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(eventIdSchema, "params"),
  deleteEvent,
);

router.get("/", validateMiddleware(getEventsSchema, "query"), getEvents);

router.get(
  "/:id",
  optionalAuth,
  validateMiddleware(eventIdSchema, "params"),
  getEventById,
);
// router.get("/:id", optionalAuth, getEventById);

router.get(
  "/organizer/:id/attendees",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(eventIdSchema, "params"),
  getEventAttendees,
);

router.get(
  "/organizer/:id/analytics",
  authMiddleware,
  authorize(ROLES.ORGANIZER),
  validateMiddleware(eventIdSchema, "params"),
  getEventAnalytics,
);

export default router;
