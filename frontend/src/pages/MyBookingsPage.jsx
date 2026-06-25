import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyBookings, useCancelBooking } from "../hooks/useBookings";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

// ─── Utilities ───────────────────────────────────────────────────────────────

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (num === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// ─── Status Filter Tabs ───────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "All", value: "ALL" },
];

// ─── Booking Card ─────────────────────────────────────────────────────────────

const BookingCard = ({ booking }) => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();

  const isConfirmed = booking.status === "CONFIRMED";
  const isPastEvent = new Date(booking.event.eventDateTime) <= new Date();
  const isEventCancelled = booking.event.isDeleted;

  const canCancel = isConfirmed && !isPastEvent && !isEventCancelled;

  return (
    <div className="bg-surface-base rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isConfirmed ? "bg-gradient-to-r from-primary-600 to-secondary-500" : "bg-border-base"}`} />

      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Event info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link
                to={`/events/${booking.eventId}`}
                className="text-text-heading font-semibold text-base hover:text-primary-600 transition-colors line-clamp-1"
              >
                {booking.event.title}
              </Link>
              {/* Status badge */}
              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isEventCancelled
                    ? "bg-danger-50 text-danger-600"
                    : isConfirmed
                    ? "bg-success-50 text-success-600"
                    : "bg-surface-muted text-text-muted"
                }`}
              >
                {isEventCancelled ? "Event Cancelled" : isConfirmed ? "✓ Confirmed" : "Cancelled"}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted mt-1">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(booking.event.eventDateTime)} · {formatTime(booking.event.eventDateTime)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {booking.event.venue}
              </span>
              <span className="flex items-center gap-1 font-medium text-text-body">
                💰 {formatPrice(booking.event.price)}
              </span>
            </div>

            {/* Booked on / cancelled on */}
            <p className="text-text-muted text-xs mt-2">
              {isConfirmed ? "Booked on" : isEventCancelled ? "Event cancelled on" : "Cancelled on"}{" "}
              <span className="text-text-body font-medium">
                {formatDate(isConfirmed ? booking.createdAt : booking.cancelledAt)}
              </span>
            </p>

            {/* Past event badge */}
            {isPastEvent && isConfirmed && !isEventCancelled && (
              <span className="inline-block mt-2 text-xs text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
                Event ended
              </span>
            )}
          </div>

          {/* Cancel action */}
          {canCancel && (
            <div className="shrink-0">
              {confirmCancel ? (
                <div className="flex flex-col gap-1.5 items-end">
                  <p className="text-xs text-text-muted">Sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="px-3 py-1.5 rounded-lg border border-border-base text-text-body text-xs font-medium hover:bg-surface-muted transition-colors"
                    >
                      Keep
                    </button>
                    <button
                      id={`confirm-cancel-${booking.id}`}
                      onClick={() =>
                        cancel(booking.id, {
                          onSuccess: () => setConfirmCancel(false),
                        })
                      }
                      disabled={isCancelling}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger-600 hover:bg-danger-600/90 text-text-inverse text-xs font-semibold transition-colors disabled:opacity-60"
                    >
                      {isCancelling ? <Spinner size="sm" /> : null}
                      {isCancelling ? "…" : "Cancel"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id={`cancel-booking-${booking.id}`}
                  onClick={() => setConfirmCancel(true)}
                  className="px-4 py-2 rounded-lg border border-border-base text-text-muted text-xs font-medium hover:bg-surface-muted hover:text-danger-600 hover:border-danger-600/30 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const MyBookingsPage = () => {
  const [activeStatus, setActiveStatus] = useState("CONFIRMED");
  const { data, isLoading, isError } = useMyBookings(activeStatus);
  const bookings = data?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading tracking-tight">
          My Bookings
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          View and manage your event bookings.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-muted rounded-xl mb-6 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            id={`filter-${tab.value.toLowerCase()}`}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? "bg-surface-base text-text-heading shadow-sm"
                : "text-text-muted hover:text-text-body"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <EmptyState
          title="Failed to load bookings"
          description="Something went wrong. Please try again."
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && bookings.length === 0 && (
        <EmptyState
          title={
            activeStatus === "CONFIRMED"
              ? "No confirmed bookings"
              : activeStatus === "CANCELLED"
              ? "No cancelled bookings"
              : "No bookings yet"
          }
          description={
            activeStatus === "CONFIRMED"
              ? "Browse upcoming events and book your seat!"
              : "Your cancelled bookings will appear here."
          }
          action={
            activeStatus === "CONFIRMED" ? (
              <Link
                to="/events"
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-text-inverse text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Events
              </Link>
            ) : null
          }
        />
      )}

      {/* Bookings list */}
      {!isLoading && !isError && bookings.length > 0 && (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
