import { useState, useCallback } from "react";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const LIMIT = 9;

const EventsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeDate, setActiveDate] = useState("");

  const { data, isLoading, isError, isFetching } = useEvents({
    page,
    limit: LIMIT,
    search: activeSearch || undefined,
    date: activeDate || undefined,
  });

  const events = data?.data?.events ?? [];
  const pagination = data?.data?.pagination ?? {};

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      setActiveSearch(search);
      setActiveDate(date);
    },
    [search, date]
  );

  const handleReset = () => {
    setSearch("");
    setDate("");
    setActiveSearch("");
    setActiveDate("");
    setPage(1);
  };

  const hasFilters = activeSearch || activeDate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading tracking-tight">
          Browse Events
        </h1>
        <p className="text-text-muted mt-1">
          Discover upcoming events and book your seat.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="events-search"
            type="text"
            placeholder="Search events by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border-base bg-surface-base text-text-body placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        {/* Date filter */}
        <input
          id="events-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border-base bg-surface-base text-text-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition w-full sm:w-44"
        />

        {/* Apply button */}
        <button
          id="events-search-btn"
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-text-inverse text-sm font-semibold transition-colors shadow-sm"
        >
          Search
        </button>

        {/* Reset */}
        {hasFilters && (
          <button
            id="events-reset-btn"
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg border border-border-base text-text-body text-sm font-medium hover:bg-surface-muted transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Results count */}
      {!isLoading && pagination.total !== undefined && (
        <p className="text-text-muted text-sm mb-6">
          {pagination.total === 0
            ? "No events found"
            : `Showing ${events.length} of ${pagination.total} events`}
          {hasFilters && (
            <button
              onClick={handleReset}
              className="ml-2 text-primary-600 hover:underline text-xs font-medium"
            >
              Clear filters
            </button>
          )}
        </p>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <EmptyState
          title="Failed to load events"
          description="Something went wrong. Please try again."
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
      )}

      {/* Empty state */}
      {!isLoading && !isError && events.length === 0 && (
        <EmptyState
          title="No events found"
          description={
            hasFilters
              ? "Try adjusting your search or date filter."
              : "No upcoming events right now. Check back soon!"
          }
          action={
            hasFilters ? (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-primary-600 text-text-inverse text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      )}

      {/* Events grid — keep showing old data while fetching (placeholderData) */}
      {!isLoading && events.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
};

export default EventsPage;
