import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEventById } from "../hooks/useEvents";
import { useCreateBooking, useCancelBooking, useMyBookings } from "../hooks/useBookings";
import Spinner from "../components/Spinner";

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

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return {
    fullDate: date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const getSeatInfo = (capacity, bookedSeats) => {
  const available = capacity - bookedSeats;
  const pct = available / capacity;
  if (available === 0)
    return {
      label: "Sold Out",
      barColor: "bg-danger-600",
      badgeColor: "bg-danger-50 text-danger-600",
    };
  if (pct <= 0.2)
    return {
      label: `Only ${available} seats left!`,
      barColor: "bg-warning-600",
      badgeColor: "bg-warning-50 text-warning-600",
    };
  return {
    label: `${available} of ${capacity} seats available`,
    barColor: "bg-success-600",
    badgeColor: "bg-success-50 text-success-600",
  };
};

// ─── Booking Card Section ─────────────────────────────────────────────────────

const BookingCard = ({ event }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isOrganizer = user?.role === "ORGANIZER";
  const isUser = user?.role === "USER";

  const [confirmCancel, setConfirmCancel] = useState(false);

  const { mutate: book, isPending: isBooking, error: bookingError, isSuccess: isBooked } = useCreateBooking();
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();

  // Fetch user's existing bookings to detect if this event is already booked
  const { data: bookingsData } = useMyBookings("ALL");
  const myBookings = bookingsData?.data ?? [];
  const existingBooking = myBookings.find(
    (b) => b.eventId === event.id && b.status === "CONFIRMED"
  );
  const alreadyBooked = !!existingBooking;

  const isSoldOut = event.capacity === event.bookedSeats;
  const isEventStarted = new Date(event.eventDateTime) <= new Date();

  const seatInfo = getSeatInfo(event.capacity, event.bookedSeats);
  const seatPct = Math.min(100, Math.round((event.bookedSeats / event.capacity) * 100));

  const bookingErrorMessage =
    bookingError?.response?.data?.message || bookingError?.message || null;

  // ── Render the action section ──

  const renderAction = () => {
    // 1. Guest
    if (!isAuthenticated) {
      return (
        <Link
          to="/login"
          id="login-to-book-btn"
          className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-text-inverse font-semibold text-sm transition-colors shadow-sm text-center block"
        >
          Log in to Book
        </Link>
      );
    }

    // 2. Organizer role — cannot book events
    if (isOrganizer) {
      return (
        <div className="w-full py-3 rounded-xl bg-surface-muted text-text-muted font-medium text-sm text-center">
          Organizers cannot book seats
        </div>
      );
    }

    // 3. Sold out
    if (isSoldOut && !alreadyBooked) {
      return (
        <button
          disabled
          className="w-full py-3 rounded-xl bg-surface-muted text-text-muted font-semibold text-sm cursor-not-allowed"
        >
          Sold Out
        </button>
      );
    }

    // 4. Already booked — show cancel flow
    if (alreadyBooked && isUser) {
      if (confirmCancel) {
        return (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-body text-center font-medium">
              Cancel this booking?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmCancel(false)}
                className="flex-1 py-2.5 rounded-xl border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors"
              >
                Keep it
              </button>
              <button
                id="confirm-cancel-btn"
                onClick={() =>
                  cancel(existingBooking.id, {
                    onSuccess: () => setConfirmCancel(false),
                  })
                }
                disabled={isCancelling}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-danger-600 hover:bg-danger-600/90 text-text-inverse text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {isCancelling ? <Spinner size="sm" /> : null}
                {isCancelling ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          {/* Booked confirmation pill */}
          <div className="w-full py-3 rounded-xl bg-success-50 border border-success-600/20 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-success-600 font-semibold text-sm">You&apos;re booked!</span>
          </div>

          {!isEventStarted && (
            <button
              id="cancel-booking-btn"
              onClick={() => setConfirmCancel(true)}
              className="w-full py-2.5 rounded-xl border border-border-base text-text-muted text-sm font-medium hover:bg-surface-muted transition-colors"
            >
              Cancel booking
            </button>
          )}

          <Link
            to="/my-bookings"
            className="text-xs text-center text-primary-600 hover:underline font-medium"
          >
            View in My Bookings →
          </Link>
        </div>
      );
    }

    // 5. Just booked (optimistic — before invalidation re-renders)
    if (isBooked) {
      return (
        <div className="w-full py-3 rounded-xl bg-success-50 border border-success-600/20 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-success-600 font-semibold text-sm">Booking confirmed!</span>
        </div>
      );
    }

    // 6. Ready to book
    return (
      <button
        id="book-seat-btn"
        onClick={() => book(event.id)}
        disabled={isBooking || isEventStarted}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-semibold text-sm transition-colors shadow-sm"
      >
        {isBooking ? (
          <>
            <Spinner size="sm" />
            Booking…
          </>
        ) : isEventStarted ? (
          "Booking Closed"
        ) : (
          "Book a Seat"
        )}
      </button>
    );
  };

  return (
    <div className="sticky top-24 bg-surface-base rounded-2xl border border-border-light shadow-sm p-6 flex flex-col gap-5">
      {/* Price */}
      <div>
        <p className="text-text-muted text-xs uppercase tracking-wider font-medium mb-1">
          Price per seat
        </p>
        <p className="text-3xl font-bold text-text-heading">
          {formatPrice(event.price)}
        </p>
      </div>

      {/* Seat availability */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-text-muted text-xs uppercase tracking-wider font-medium">
            Availability
          </p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${seatInfo.badgeColor}`}>
            {seatInfo.label}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${seatInfo.barColor}`}
            style={{ width: `${seatPct}%` }}
          />
        </div>
        <p className="text-text-muted text-xs mt-1.5">
          {event.bookedSeats} / {event.capacity} seats booked
        </p>
      </div>

      {/* Booking error */}
      {bookingErrorMessage && (
        <div className="bg-danger-50 border border-danger-600/20 rounded-lg px-3 py-2.5">
          <p className="text-danger-600 text-xs font-medium">{bookingErrorMessage}</p>
        </div>
      )}

      {/* Action */}
      {renderAction()}

      {/* Organizer info */}
      {event.organizer && (
        <p className="text-text-muted text-xs text-center">
          Hosted by <span className="font-medium text-text-body">{event.organizer.name}</span>
        </p>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const EventDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useEventById(id);
  const event = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-text-heading mb-2">
          Event not found
        </p>
        <p className="text-text-muted mb-6">
          This event may have been removed or doesn&apos;t exist.
        </p>
        <Link
          to="/events"
          className="px-5 py-2.5 rounded-lg bg-primary-600 text-text-inverse text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Browse all events
        </Link>
      </div>
    );
  }

  const { fullDate, time } = formatDateTime(event.eventDateTime);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-text-muted text-sm hover:text-text-body transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Main info ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Color accent bar */}
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-500" />

          {/* Title */}
          <h1 className="text-3xl font-bold text-text-heading leading-tight">
            {event.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-col gap-3">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-text-heading font-semibold text-sm">{fullDate}</p>
                <p className="text-text-muted text-sm">{time}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-text-heading font-semibold text-sm">Venue</p>
                <p className="text-text-muted text-sm">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-text-heading font-semibold text-base mb-2">
              About this event
            </h2>
            <p className="text-text-body text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* ── Right: Booking card ── */}
        <div className="lg:col-span-1">
          <BookingCard event={event} />
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

