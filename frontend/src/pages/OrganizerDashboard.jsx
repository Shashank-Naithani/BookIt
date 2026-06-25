import { useState } from "react";
import { useOrganizerEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useEventAnalytics, useEventAttendees } from "../hooks/useEvents";
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

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Convert ISO string to datetime-local input value
const toDatetimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// ─── Stat Tile ────────────────────────────────────────────────────────────────

const StatTile = ({ icon, label, value, sub, accent }) => (
  <div className={`bg-surface-muted rounded-xl p-4 flex flex-col gap-1 border ${accent ? "border-primary-600/20" : "border-border-light"}`}>
    <span className="text-xl">{icon}</span>
    <p className="text-2xl font-bold text-text-heading">{value}</p>
    <p className="text-xs font-medium text-text-muted">{label}</p>
    {sub && <p className="text-xs text-text-muted">{sub}</p>}
  </div>
);

// ─── Analytics Tab ────────────────────────────────────────────────────────────

const AnalyticsTab = ({ eventId }) => {
  const { data, isLoading, isError } = useEventAnalytics(eventId);
  const analytics = data?.data?.analytics;

  if (isLoading) return (
    <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  );

  if (isError || !analytics) return (
    <div className="py-12 text-center text-text-muted text-sm">
      Failed to load analytics. Please try again.
    </div>
  );

  const pct = analytics.occupancyRate;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile icon="👁️" label="Total Views" value={analytics.totalViews.toLocaleString()} />
        <StatTile icon="✅" label="Confirmed" value={analytics.confirmedBookings} accent />
        <StatTile icon="❌" label="Cancelled" value={analytics.cancelledBookings} />
        <StatTile icon="💺" label="Available Seats" value={analytics.availableSeats} />
        <StatTile
          icon="📊"
          label="Occupancy Rate"
          value={`${pct}%`}
          sub={pct >= 80 ? "🔥 High demand" : pct >= 50 ? "📈 Good pace" : "📉 Low demand"}
          accent={pct >= 80}
        />
        <StatTile
          icon="💰"
          label="Revenue"
          value={formatPrice(analytics.revenue)}
          accent={analytics.revenue > 0}
        />
      </div>

      {/* Occupancy progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-medium text-text-body">Occupancy</p>
          <p className="text-xs text-text-muted">{pct}%</p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-surface-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct === 100
                ? "bg-danger-600"
                : pct >= 80
                ? "bg-warning-600"
                : "bg-success-600"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Attendees Tab ────────────────────────────────────────────────────────────

const AttendeesTab = ({ eventId }) => {
  const { data, isLoading, isError } = useEventAttendees(eventId);
  const [search, setSearch] = useState("");

  const payload = data?.data;
  const attendees = payload?.attendees ?? [];

  const filtered = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  );

  if (isError) return (
    <div className="py-12 text-center text-text-muted text-sm">
      Failed to load attendees.
    </div>
  );

  if (attendees.length === 0) return (
    <div className="py-12 text-center">
      <p className="text-4xl mb-3">🎟️</p>
      <p className="text-text-heading font-semibold text-sm">No attendees yet</p>
      <p className="text-text-muted text-xs mt-1">Bookings will appear here once users register.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="attendee-search"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-base bg-surface-muted text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>

      {/* Count */}
      <p className="text-xs text-text-muted">
        Showing <span className="font-medium text-text-body">{filtered.length}</span> of{" "}
        <span className="font-medium text-text-body">{attendees.length}</span> attendees
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border-light overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-muted border-b border-border-light">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Booked On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-text-muted text-xs">
                  No results for &quot;{search}&quot;
                </td>
              </tr>
            ) : (
              filtered.map((attendee, i) => (
                <tr key={attendee.bookingId} className={`hover:bg-surface-muted/60 transition-colors ${i % 2 === 0 ? "" : "bg-surface-muted/30"}`}>
                  <td className="px-4 py-3 font-medium text-text-heading">{attendee.name}</td>
                  <td className="px-4 py-3 text-text-muted">{attendee.email}</td>
                  <td className="px-4 py-3 text-right text-text-muted whitespace-nowrap">{formatDate(attendee.bookedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Event Detail Drawer ──────────────────────────────────────────────────────

const DRAWER_TABS = [
  { id: "analytics", label: "📊 Analytics" },
  { id: "attendees", label: "🎟️ Attendees" },
];

const EventDetailDrawer = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl flex flex-col bg-surface-base border-l border-border-light shadow-2xl animate-slideInRight">
        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border-light shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Event Details</p>
            <h2 className="text-text-heading font-bold text-lg leading-tight line-clamp-2">{event.title}</h2>
            <p className="text-text-muted text-xs mt-1">
              📅 {formatDateTime(event.eventDateTime)} · 📍 {event.venue}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-muted transition-colors shrink-0 mt-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-border-light shrink-0">
          {DRAWER_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`drawer-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all border-b-2 ${
                activeTab === tab.id
                  ? "text-primary-600 border-primary-600 bg-primary-50/50"
                  : "text-text-muted border-transparent hover:text-text-body"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "analytics" && <AnalyticsTab eventId={event.id} />}
          {activeTab === "attendees" && <AttendeesTab eventId={event.id} />}
        </div>
      </div>
    </>
  );
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

const OrganizerEventRow = ({ event, onEdit, onViewDetails }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const available = event.capacity - event.bookedSeats;
  const isSoldOut = available === 0;
  const pct = Math.round((event.bookedSeats / event.capacity) * 100);

  const handleDelete = () => {
    deleteEvent(event.id);
  };

  return (
    <div className="bg-surface-base rounded-xl border border-border-light p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary-600/30 transition-colors">
      {/* Info — clickable to open drawer */}
      <button
        className="flex-1 min-w-0 text-left"
        onClick={() => onViewDetails(event)}
      >
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
      </button>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-danger-600 hover:bg-danger-600/90 text-text-inverse text-sm font-medium transition-colors disabled:opacity-60"
            >
              {isDeleting ? <Spinner size="sm" /> : "Delete"}
            </button>
          </div>
        ) : (
          <>
            <button
              id={`view-event-${event.id}`}
              onClick={() => onViewDetails(event)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-primary-600/30 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
            <button
              id={`edit-event-${event.id}`}
              onClick={() => onEdit(event)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-danger-600/30 text-danger-600 text-sm font-medium hover:bg-danger-50 transition-colors w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const OrganizerDashboard = () => {
  const { data, isLoading, isError } = useOrganizerEvents();
  const events = data?.data ?? [];

  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', event }
  const [drawerEvent, setDrawerEvent] = useState(null); // null | event object

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
              onViewDetails={(e) => setDrawerEvent(e)}
            />
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      {modal && (
        <EventFormModal
          mode={modal.mode}
          event={modal.event}
          onClose={() => setModal(null)}
        />
      )}

      {/* Event Detail Drawer */}
      {drawerEvent && (
        <EventDetailDrawer
          event={drawerEvent}
          onClose={() => setDrawerEvent(null)}
        />
      )}
    </div>
  );
};

export default OrganizerDashboard;
