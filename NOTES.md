# Architecture & Technical Notes

## 1. Concurrency & No-Oversell Guarantee

**Approach:** I strictly enforced the no-oversell guarantee at the database level using atomic row-level locks in PostgreSQL, rather than relying on application-level checks.

**Why:** Fetching the capacity into Node.js memory (`SELECT bookedSeats`), checking the limit, and then saving (`UPDATE bookedSeats`) creates severe race conditions when multiple concurrent requests hit the API simultaneously. Instead, the core booking logic executes this raw SQL:

```sql
UPDATE "Event"
SET "bookedSeats" = "bookedSeats" + 1
WHERE id = $1 AND "bookedSeats" < "capacity"
```

Because PostgreSQL serializes updates to the same row, if two simultaneous requests attempt to book the exact same final seat, the database places a row-level lock. The first request succeeds. For the second request, the `WHERE "bookedSeats" < "capacity"` condition evaluates to false, updating 0 rows. Our backend catches the 0-row update and safely returns a `409 Conflict (Sold Out)` error. It is physically impossible to double-book a seat with this approach.

## 2. Schema & Indexing Decisions

- **`Event` table indexes:** Added `@@index([title])`, `@@index([eventDateTime])`, and a composite `@@index([title, eventDateTime])` to ensure fast text searching, date filtering, and combined pagination queries at scale (100k+ rows).
- **Soft Deletion:** Added an `@@index([isDeleted])` and `@@index([isDeleted, eventDateTime])` to instantly filter out cancelled events from the public feed without scanning the whole table.
- **`Booking` table constraints:** Created a composite unique constraint `@@unique([userId, eventId])` to natively prevent users from double-booking the same event at the database schema level.
- **`ActivityLog` table:** Used an append-only log model with indexes on `[eventId, action]` for lightning-fast aggregation when generating the organizer's analytics view.
