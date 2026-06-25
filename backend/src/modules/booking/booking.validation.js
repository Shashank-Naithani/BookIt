import Joi from "joi";

export const createBookingSchema = Joi.object({
  eventId: Joi.string()
    .guid({
      version: ["uuidv4", "uuidv5"],
    })
    .required(),
});
