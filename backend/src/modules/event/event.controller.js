import asyncHandler from "../../shared/utils/asyncHandler.js";
import sendSuccessResponse from "../../shared/utils/sendSuccessResponse.js";
import { RESPONSE_CODES } from "../../shared/constants/responseCodes.js";
import {
  createEventService,
  getOrganizerEventsService,
  updateEventService,
  getEventsService,
  getEventByIdService,
  deleteEventService,
  getEventAttendeesService,
  getEventAnalyticsService,
} from "./event.service.js";

export const createEvent = asyncHandler(async (req, res) => {
  const event = await createEventService(req.body, req.user.userId);

  return sendSuccessResponse(
    res,
    201,
    RESPONSE_CODES.EVENT_CREATED,
    "Event created successfully",
    event,
  );
});

export const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await getOrganizerEventsService(req.user.userId);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.EVENTS_FETCHED,
    "Events fetched successfully",
    events,
  );
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await updateEventService(
    req.params.id,
    req.body,
    req.user.userId,
  );

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.EVENT_UPDATED,
    "Event updated successfully",
    event,
  );
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await deleteEventService(req.params.id, req.user.userId);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.EVENT_DELETED,
    "Event deleted successfully",
  );
});

export const getEvents = asyncHandler(async (req, res) => {
  const result = await getEventsService(req.validatedQuery);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.EVENTS_FETCHED,
    "Events fetched successfully",
    result,
  );
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await getEventByIdService(req.params.id, req.user?.userId);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.EVENT_FETCHED,
    "Event fetched successfully",
    event,
  );
});

// export const getEventById = asyncHandler(async (req, res) => {
//   const event = await getEventByIdService(req.params.id, req.user?.userId);

//   return sendSuccessResponse(
//     res,
//     200,
//     RESPONSE_CODES.EVENT_FETCHED,
//     "Event fetched successfully",
//     event,
//   );
// });

export const getEventAttendees = asyncHandler(async (req, res) => {
  const data = await getEventAttendeesService(req.params.id, req.user.userId);

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.ATTENDEES_FETCHED,
    "Attendees fetched successfully",
    data,
  );
});

export const getEventAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getEventAnalyticsService(
    req.params.id,
    req.user.userId,
  );

  return sendSuccessResponse(
    res,
    200,
    RESPONSE_CODES.ANALYTICS_FETCHED,
    "Analytics fetched successfully",
    analytics,
  );
});
