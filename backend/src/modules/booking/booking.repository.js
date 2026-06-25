import { Prisma } from "@prisma/client";
import prisma from "../../config/db.js";
import { BOOKING_STATUS } from "../../shared/constants/bookingStatus.js";

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

export const findBookingsByUser = async (userId, status, db = prisma) => {
  const where = {
    userId,
  };

  if (status !== "ALL") {
    where.status = status;
  }

  return db.booking.findMany({
    where,
    include: {
      event: {
        select: {
          id: true,
          title: true,
          venue: true,
          eventDateTime: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findBookingById = async (bookingId, db = prisma) => {
  return db.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
};

export const cancelBooking = async (bookingId, db = prisma) => {
  return db.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BOOKING_STATUS.CANCELLED,
      cancelledAt: new Date(),
    },
  });
};

export const releaseSeat = async (eventId, db = prisma) => {
  return db.event.update({
    where: {
      id: eventId,
    },
    data: {
      bookedSeats: {
        decrement: 1,
      },
    },
  });
};
