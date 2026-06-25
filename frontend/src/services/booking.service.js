import axiosClient from "../lib/axiosClient";

export const createBooking = async (eventId) => {
  const response = await axiosClient.post("/bookings", { eventId });
  return response.data;
};

export const getMyBookings = async (status = "CONFIRMED") => {
  const response = await axiosClient.get("/bookings/my-bookings", {
    params: { status },
  });
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axiosClient.delete(`/bookings/${bookingId}`);
  return response.data;
};
