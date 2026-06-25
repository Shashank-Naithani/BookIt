import Joi from "joi";

export const createBookingSchema = Joi.object({
  eventId: Joi.string()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required(),
});

export const getMyBookingsSchema = Joi.object({
  status: Joi.string()
    .valid("CONFIRMED", "CANCELLED", "ALL")
    .default("CONFIRMED"),
});

export const bookingIdSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required(),
});
