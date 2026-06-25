import { Router } from "express";
import { createBooking, getMyBookings } from "./booking.controller.js";
import {
  bookingIdSchema,
  createBookingSchema,
  getMyBookingsSchema,
} from "./booking.validation.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validateMiddleware from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../shared/constants/roles.js";
import { cancelBooking } from "./booking.repository.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize(ROLES.USER),
  validateMiddleware(createBookingSchema),
  createBooking,
);

router.get(
  "/my-bookings",
  authMiddleware,
  authorize(ROLES.USER),
  validateMiddleware(getMyBookingsSchema, "query"),
  getMyBookings,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(ROLES.USER),
  validateMiddleware(bookingIdSchema, "params"),
  cancelBooking,
);
export default router;
