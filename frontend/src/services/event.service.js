import axiosClient from "../lib/axiosClient";

export const getEvents = async (params = {}) => {
  const response = await axiosClient.get("/events", { params });
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axiosClient.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (data) => {
  const response = await axiosClient.post("/events/organizer", data);
  return response.data;
};

export const getOrganizerEvents = async () => {
  const response = await axiosClient.get("/events/organizer");
  return response.data;
};

export const updateEvent = async ({ id, ...data }) => {
  const response = await axiosClient.patch(`/events/organizer/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axiosClient.delete(`/events/organizer/${id}`);
  return response.data;
};

export const getEventAnalytics = async (eventId) => {
  const response = await axiosClient.get(`/events/organizer/${eventId}/analytics`);
  return response.data;
};

export const getEventAttendees = async (eventId) => {
  const response = await axiosClient.get(`/events/organizer/${eventId}/attendees`);
  return response.data;
};

