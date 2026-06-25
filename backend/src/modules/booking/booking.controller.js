import asyncHandler from "../../shared/utils/asyncHandler.js";
import sendSuccessResponse from "../../shared/utils/sendSuccessResponse.js";
import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import {
  cancelBookingService,
  createBookingService,
  getMyBookingsService,
} from "./booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingService(req.user.userId, req.body.eventId);

  return sendSuccessResponse(
    res,
    201,
    RESPONSE_CODES.BOOKING_CREATED,
    "Booking created successfully",
    booking,
  );
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getMyBookingsService(
    req.user.userId,
    req.validatedQuery.status,
  );

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.BOOKINGS_FETCHED,
    "Bookings fetched successfully",
    bookings,
  );
});

export const cancelBooking = asyncHandler(async (req, res) => {
  await cancelBookingService(req.params.id, req.user.userId);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.BOOKING_CANCELLED,
    "Booking cancelled successfully",
  );
});
