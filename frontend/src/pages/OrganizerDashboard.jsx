import { useState } from "react";
import { useOrganizerEvents, useCreateEvent, useUpdateEvent } from "../hooks/useEvents";
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

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Convert ISO string to datetime-local input value
const toDatetimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// ─── Event Form Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "",
  description: "",
  venue: "",
  eventDateTime: "",
  capacity: "",
  price: "",
};

const EventFormModal = ({ mode, event, onClose }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(
    isEdit
      ? {
          title: event.title,
          description: event.description,
          venue: event.venue,
          eventDateTime: toDatetimeLocal(event.eventDateTime),
          capacity: String(event.capacity),
          price: String(event.price),
        }
      : EMPTY_FORM
  );

  const { mutate: create, isPending: isCreating, error: createError } = useCreateEvent();
  const { mutate: update, isPending: isUpdating, error: updateError } = useUpdateEvent();

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;
  const errorMessage = error?.response?.data?.message || error?.message || null;
  const fieldErrors = error?.response?.data?.errors || [];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      price: Number(form.price),
    };

    if (isEdit) {
      update({ id: event.id, ...payload }, { onSuccess: onClose });
    } else {
      create(payload, { onSuccess: onClose });
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-base rounded-2xl shadow-xl border border-border-light w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-text-heading font-semibold text-lg">
            {isEdit ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Error banner */}
          {errorMessage && (
            <div className="bg-danger-50 border border-danger-600/20 rounded-lg px-4 py-3">
              <p className="text-danger-600 text-sm font-medium">{errorMessage}</p>
              {fieldErrors.length > 0 && (
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  {fieldErrors.map((err, i) => (
                    <li key={i} className="text-danger-600 text-xs">{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="event-title" className="block text-sm font-medium text-text-body">
              Title <span className="text-danger-600">*</span>
            </label>
            <input
              id="event-title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. React India Conference 2025"
              className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="event-desc" className="block text-sm font-medium text-text-body">
              Description <span className="text-danger-600">*</span>
            </label>
            <textarea
              id="event-desc"
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Tell attendees what this event is about…"
              className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Venue */}
          <div className="space-y-1.5">
            <label htmlFor="event-venue" className="block text-sm font-medium text-text-body">
              Venue <span className="text-danger-600">*</span>
            </label>
            <input
              id="event-venue"
              name="venue"
              type="text"
              required
              value={form.venue}
              onChange={handleChange}
              placeholder="e.g. Bangalore International Centre"
              className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <label htmlFor="event-datetime" className="block text-sm font-medium text-text-body">
              Date & Time <span className="text-danger-600">*</span>
            </label>
            <input
              id="event-datetime"
              name="eventDateTime"
              type="datetime-local"
              required
              value={form.eventDateTime}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Capacity & Price (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="event-capacity" className="block text-sm font-medium text-text-body">
                Capacity <span className="text-danger-600">*</span>
              </label>
              <input
                id="event-capacity"
                name="capacity"
                type="number"
                min="1"
                required
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 200"
                className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="event-price" className="block text-sm font-medium text-text-body">
                Price (₹) <span className="text-danger-600">*</span>
              </label>
              <input
                id="event-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                placeholder="0 for Free"
                className="w-full px-4 py-2.5 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors"
            >
              Cancel
            </button>
            <button
              id="event-form-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-text-inverse font-semibold text-sm transition-colors shadow-sm"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" />
                  {isEdit ? "Saving…" : "Creating…"}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Organizer Event Row ──────────────────────────────────────────────────────

const OrganizerEventRow = ({ event, onEdit }) => {
  const available = event.capacity - event.bookedSeats;
  const isSoldOut = available === 0;
  const pct = Math.round((event.bookedSeats / event.capacity) * 100);

  return (
    <div className="bg-surface-base rounded-xl border border-border-light p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-text-heading font-semibold text-sm truncate">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-text-muted">
          <span>📅 {formatDateTime(event.eventDateTime)}</span>
          <span>📍 {event.venue}</span>
          <span>💰 {formatPrice(event.price)}</span>
        </div>
        {/* Seat progress */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${isSoldOut ? "bg-danger-600" : pct >= 80 ? "bg-warning-600" : "bg-success-600"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {event.bookedSeats}/{event.capacity} booked
          </span>
        </div>
      </div>

      {/* Edit button */}
      <button
        id={`edit-event-${event.id}`}
        onClick={() => onEdit(event)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const OrganizerDashboard = () => {
  const { data, isLoading, isError } = useOrganizerEvents();
  const events = data?.data ?? [];

  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', event }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-heading tracking-tight">
            My Events
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Manage the events you&apos;ve created.
          </p>
        </div>
        <button
          id="create-event-btn"
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-text-inverse text-sm font-semibold transition-colors shadow-sm shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </button>
      </div>

      {/* Stats summary */}
      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Events",
              value: events.length,
              icon: "🗓️",
            },
            {
              label: "Total Capacity",
              value: events.reduce((s, e) => s + e.capacity, 0),
              icon: "👥",
            },
            {
              label: "Seats Booked",
              value: events.reduce((s, e) => s + e.bookedSeats, 0),
              icon: "🎟️",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-base rounded-xl border border-border-light p-4 text-center"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-xl font-bold text-text-heading">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <EmptyState
          title="Failed to load your events"
          description="Something went wrong. Please try refreshing."
        />
      )}

      {/* Empty */}
      {!isLoading && !isError && events.length === 0 && (
        <EmptyState
          title="No events yet"
          description="Create your first event and start accepting bookings."
          action={
            <button
              onClick={() => setModal({ mode: "create" })}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-text-inverse text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Create Event
            </button>
          }
        />
      )}

      {/* Events list */}
      {!isLoading && !isError && events.length > 0 && (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <OrganizerEventRow
              key={event.id}
              event={event}
              onEdit={(e) => setModal({ mode: "edit", event: e })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <EventFormModal
          mode={modal.mode}
          event={modal.event}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default OrganizerDashboard;
