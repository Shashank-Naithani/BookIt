import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),

  description: Joi.string().trim().required(),

  venue: Joi.string().trim().required(),

  eventDateTime: Joi.date().greater("now").required(),

  capacity: Joi.number().integer().min(1).required(),

  price: Joi.number().min(0).required(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),

  description: Joi.string().trim(),

  venue: Joi.string().trim(),

  eventDateTime: Joi.date().greater("now"),

  capacity: Joi.number().integer().min(1),

  price: Joi.number().min(0),
}).min(1);

export const getEventsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),

  search: Joi.string().trim().allow(""),

  date: Joi.date(),
});
