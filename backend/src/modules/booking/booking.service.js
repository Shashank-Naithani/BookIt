import prisma from "../../config/db.js";
import ApiError from "../../shared/errors/ApiError.js";
import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import { ACTIVITY_TYPES } from "../../shared/constants/activityTypes.js";
import {
  createBooking,
  findBookingByUserAndEvent,
  reserveSeat,
} from "./booking.repository.js";
import { findEventById, createActivityLog } from "../event/event.repository.js";
import { Prisma } from "@prisma/client";

export const createBookingService = async (userId, eventId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Find Event
      const event = await findEventById(eventId, tx);

      if (!event) {
        throw new ApiError(
          404,
          RESPONSE_CODES.EVENT_NOT_FOUND,
          "Event not found",
        );
      }

      // 2. Event Already Started
      if (event.eventDateTime <= new Date()) {
        throw new ApiError(
          400,
          RESPONSE_CODES.EVENT_ALREADY_STARTED,
          "Booking is closed",
        );
      }

      // 3. Already Booked
      const existingBooking = await findBookingByUserAndEvent(
        userId,
        eventId,
        tx,
      );

      if (existingBooking && existingBooking.status === "CONFIRMED") {
        throw new ApiError(
          409,
          RESPONSE_CODES.BOOKING_ALREADY_EXISTS,
          "You have already booked this event",
        );
      }

      // 4. Reserve Seat (Atomic)
      const updatedRows = await reserveSeat(eventId, tx);

      if (updatedRows === 0) {
        throw new ApiError(
          409,
          RESPONSE_CODES.EVENT_SOLD_OUT,
          "Event is sold out",
        );
      }

      // 5. Create Booking
      const booking = await createBooking(
        {
          userId,
          eventId,
        },
        tx,
      );

      // 6. Activity Log
      await createActivityLog(
        {
          eventId,
          userId,
          action: ACTIVITY_TYPES.BOOKING_CONFIRMED,
        },
        tx,
      );

      return booking;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(
        409,
        RESPONSE_CODES.BOOKING_ALREADY_EXISTS,
        "You have already booked this event",
      );
    }

    throw error;
  }
};
