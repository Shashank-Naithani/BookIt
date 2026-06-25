import { Prisma } from "@prisma/client";
import prisma from "../../config/db.js";

export const findBookingByUserAndEvent = async (
  userId,
  eventId,
  db = prisma,
) => {
  return db.booking.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });
};

export const createBooking = async (bookingData, db = prisma) => {
  return db.booking.create({
    data: bookingData,
  });
};

export const reserveSeat = async (eventId, db = prisma) => {
  const updatedRows = await db.$executeRaw(
    Prisma.sql`
            UPDATE "Event"
            SET "bookedSeats" = "bookedSeats" + 1
            WHERE
                id = ${eventId}
                AND "bookedSeats" < "capacity"
        `,
  );

  return updatedRows;
};
