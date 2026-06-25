import { Link } from "react-router-dom";

// Utility: format a price (Prisma Decimal comes as string)
const formatPrice = (price) => {
  const num = parseFloat(price);
  if (num === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

// Utility: format event date/time
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

// Seat availability level
const getSeatStatus = (capacity, bookedSeats) => {
  const available = capacity - bookedSeats;
  const pct = available / capacity;
  if (available === 0) return { label: "Sold Out", color: "text-danger-600 bg-danger-50" };
  if (pct <= 0.2) return { label: `Only ${available} left`, color: "text-warning-600 bg-warning-50" };
  return { label: `${available} seats left`, color: "text-success-600 bg-success-50" };
};

const EventCard = ({ event }) => {
  const { date, time } = formatDateTime(event.eventDateTime);
  const seatStatus = getSeatStatus(event.capacity, event.bookedSeats);
  const isSoldOut = event.capacity === event.bookedSeats;

  return (
    <Link
      to={`/events/${event.id}`}
      id={`event-card-${event.id}`}
      className="group block bg-surface-base rounded-2xl border border-border-light shadow-sm hover:shadow-md hover:border-primary-500/40 transition-all duration-200"
    >
      {/* Color bar accent */}
      <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-primary-600 to-secondary-500" />

      <div className="p-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-text-heading font-semibold text-base leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Venue */}
        <div className="flex flex-col gap-1.5 text-sm text-text-muted">
          {/* Date/Time */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {date} · {time}
            </span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Footer: Price + Seat status */}
        <div className="flex items-center justify-between pt-2 border-t border-border-light mt-auto">
          <span className="text-text-heading font-bold text-base">
            {formatPrice(event.price)}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${seatStatus.color} ${isSoldOut ? "opacity-80" : ""}`}>
            {seatStatus.label}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
