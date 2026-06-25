import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import Spinner from "../components/Spinner";

const LandingPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isOrganizer = user?.role === "ORGANIZER";

  const { data, isLoading } = useEvents({ limit: 6 });
  const upcomingEvents = data?.data?.events ?? [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-app">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-600 text-text-inverse py-24 px-4">
        {/* Background blur accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wider uppercase mb-5">
            ✦ Discover · Book · Experience
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-5">
            Find events you&apos;ll{" "}
            <span className="underline decoration-wavy decoration-white/40">
              love
            </span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Browse upcoming events, secure your seat, and make memories — all
            in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/events"
              id="hero-browse-btn"
              className="px-6 py-3 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-white/90 transition-colors shadow-lg"
            >
              Browse Events →
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                id="hero-register-btn"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20"
              >
                Sign up free
              </Link>
            )}

            {isAuthenticated && isOrganizer && (
              <Link
                to="/organizer"
                id="hero-organizer-btn"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20"
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events Preview ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-heading">
              Upcoming Events
            </h2>
            <p className="text-text-muted text-sm mt-1">
              Don&apos;t miss what&apos;s happening near you.
            </p>
          </div>
          <Link
            to="/events"
            id="view-all-events-btn"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors hidden sm:block"
          >
            View all →
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {/* Events grid */}
        {!isLoading && upcomingEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* No events */}
        {!isLoading && upcomingEvents.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <p className="text-4xl mb-3">🗓️</p>
            <p className="font-medium text-text-body">No upcoming events yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}

        {/* Mobile view-all */}
        {!isLoading && upcomingEvents.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/events"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all events →
            </Link>
          </div>
        )}
      </section>

      {/* ── Organizer CTA (for guests) ───────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="bg-surface-base border-t border-border-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
            <h2 className="text-2xl font-bold text-text-heading mb-2">
              Hosting an event?
            </h2>
            <p className="text-text-muted mb-6">
              Register as an Organizer to create and manage your events.
            </p>
            <Link
              to="/register"
              id="organizer-signup-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-text-inverse font-semibold text-sm transition-colors shadow-sm"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;

