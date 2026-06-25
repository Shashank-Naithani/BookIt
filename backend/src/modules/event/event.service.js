import { ACTIVITY_TYPES } from "../../shared/constants/activityTypes.js";
import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import ApiError from "../../shared/errors/ApiError.js";
import {
  createEvent,
  findOrganizerEvents,
  findEventById,
  updateEvent,
  findEvents,
  createActivityLog,
  deleteEventById,
} from "./event.repository.js";
import { cancelAllBookingsForEvent } from "../booking/booking.repository.js";

// Organizer Services

export const createEventService = async (eventData, organizerId) => {
  return createEvent({
    ...eventData,
    organizerId,
  });
};

export const getOrganizerEventsService = async (organizerId) => {
  return findOrganizerEvents(organizerId);
};

export const updateEventService = async (eventId, updateData, organizerId) => {
  const event = await findEventById(eventId);

  if (!event) {
    throw new ApiError(404, RESPONSE_CODES.EVENT_NOT_FOUND, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new ApiError(403, RESPONSE_CODES.FORBIDDEN, "Access denied");
  }

  if (
    updateData.capacity !== undefined &&
    updateData.capacity < event.bookedSeats
  ) {
    throw new ApiError(
      409,
      RESPONSE_CODES.CAPACITY_LESS_THAN_BOOKED_SEATS,
      "Capacity cannot be less than booked seats",
    );
  }

  return updateEvent(eventId, updateData);
};

export const deleteEventService = async (eventId, organizerId) => {
  const event = await findEventById(eventId);

  if (!event) {
    throw new ApiError(404, RESPONSE_CODES.EVENT_NOT_FOUND, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new ApiError(403, RESPONSE_CODES.FORBIDDEN, "Access denied");
  }

  await deleteEventById(eventId);
  await cancelAllBookingsForEvent(eventId);
  
  return;
};

// User & Public Services
export const getEventsService = async ({ page, limit, search, date }) => {
  const skip = (page - 1) * limit;

  const { events, total } = await findEvents({
    search,
    date,
    skip,
    take: limit,
  });

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// export const getEventByIdService = async (eventId, userId = null) => {
//   const event = await findEventById(eventId);

//   if (!event) {
//     throw new ApiError(404, RESPONSE_CODES.EVENT_NOT_FOUND, "Event not found");
//   }

//   await createActivityLog({
//     eventId,
//     userId,
//     action: ACTIVITY_TYPES.EVENT_VIEWED,
//   });

//   return event;
// };

export const getEventByIdService = async (eventId, userId = null) => {
  const event = await findEventById(eventId);

  if (!event) {
    throw new ApiError(404, RESPONSE_CODES.EVENT_NOT_FOUND, "Event not found");
  }

  await createActivityLog({
    eventId: event.id,
    userId,
    action: ACTIVITY_TYPES.EVENT_VIEWED,
  });

  return event;
};
