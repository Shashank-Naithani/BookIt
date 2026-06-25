import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  getEventById,
  getEvents,
  getOrganizerEvents,
  updateEvent,
} from "../services/event.service";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const eventKeys = {
  all: ["events"],
  lists: () => [...eventKeys.all, "list"],
  list: (params) => [...eventKeys.lists(), params],
  detail: (id) => [...eventKeys.all, "detail", id],
  organizer: () => [...eventKeys.all, "organizer"],
};

// ─── Public Queries ──────────────────────────────────────────────────────────

// Browse/search events with pagination
export const useEvents = (params = {}) => {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => getEvents(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });
};

// Single event detail
export const useEventById = (id) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ─── Organizer Queries ───────────────────────────────────────────────────────

// Organizer's own events list
export const useOrganizerEvents = () => {
  return useQuery({
    queryKey: eventKeys.organizer(),
    queryFn: getOrganizerEvents,
    staleTime: 1000 * 60 * 2,
  });
};

// ─── Organizer Mutations ─────────────────────────────────────────────────────

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      // Invalidate both the organizer list and public list
      queryClient.invalidateQueries({ queryKey: eventKeys.organizer() });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.organizer() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};
