import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  cancelBooking,
  getMyBookings,
} from "../services/booking.service";
import { eventKeys } from "./useEvents";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const bookingKeys = {
  all: ["bookings"],
  mine: () => [...bookingKeys.all, "mine"],
  mineWithStatus: (status) => [...bookingKeys.mine(), status],
};

// ─── Queries ─────────────────────────────────────────────────────────────────

// Fetches the logged-in user's bookings, optionally filtered by status
export const useMyBookings = (status = "ALL") => {
  return useQuery({
    queryKey: bookingKeys.mineWithStatus(status),
    queryFn: () => getMyBookings(status),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (_, eventId) => {
      // Invalidate event detail so the booked seats count refreshes
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      // Invalidate all user booking queries so MyBookingsPage stays fresh
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine() });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      // Invalidate all booking queries to refresh the list
      queryClient.invalidateQueries({ queryKey: bookingKeys.mine() });
      // Also invalidate all event details so seat counts refresh everywhere
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
};
