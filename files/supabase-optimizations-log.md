# Supabase Database & Realtime Optimization Log

This document tracks the historical and newly implemented database and real-time optimization strategies for `jdr-app`, aimed at minimizing compute usage, database reads, and staying well within Supabase's free tier limits.

## 1. Legacy Optimizations (Migrated & Improved)

These were the initial strategies identified during the transition from the legacy app architecture:

*   **Replace Polling with Real-Time Events:** We successfully transitioned from continuous polling (`setInterval` with `router.refresh()`) to using Supabase Realtime to push updates, significantly reducing continuous DB load.
*   **Limit Payload Size with Strict Selects:** Refactored queries to use `select: { ... }` instead of fetching entire table rows (`include: { ... }`) where only a few fields are needed by the UI.
*   **Rethink JSON Snapshot Updates:** Changed the `cardsSnapshot` updates (`drawCardFromDeck` and `revealCard`) to utilize raw SQL `JSONB` partial updates (`jsonb_set`) rather than fetching the whole blob into Node, modifying it, and re-saving it.

## 2. Recent Active Optimizations Implemented

We further refined the architecture to cut down redundant operations:

*   **Eliminated Server Action/Realtime Read Conflicts:**
    *   *Problem:* Server actions used `revalidatePath`, triggering a data refetch for the acting player. Simultaneously, Supabase Realtime broadcasted the change, triggering `router.refresh()` on the client, causing a double-fetch.
    *   *Solution:* Removed `revalidatePath` from server actions (like `performDraw`, `setActivePlayer`). The client now relies entirely on the Supabase Realtime event payload to trigger the UI update.
*   **Removed Database Queries for Card Randomization:**
    *   *Evolution:* Initially, we considered using `ORDER BY RANDOM()` in SQL (Legacy idea #3). However, this requires a full table scan.
    *   *Solution:* We completely eliminated the DB query by loading the static deck from `src/lib/card-library.json`. We now extract all IDs, perform an in-memory Fisher-Yates shuffle in `src/lib/jdr-actions.ts`, and slice the required count.
*   **Consolidated Realtime Channels (Multiplexing):**
    *   *Problem:* The app opened 3 separate websocket channels per player (`Room`, `Draw`, `Player`), quickly burning through the Supabase connection quota.
    *   *Solution:* Multiplexed the subscriptions into a single channel per room (`game:${room.id}`), grouping `postgres_changes` events for all three tables onto one connection.
*   **Automated Database Pruning via Cron:**
    *   *Solution:* Updated the Vercel cron job (`website/src/app/api/cron/route.ts`) to do more than just wake the DB. It now actively queries and deletes `Room` and `Draw` records that are older than 3 days. This prevents unlimited database growth and keeps Realtime payload sizes optimized over the long term.

## 3. Potential Future Improvements

To squeeze even more efficiency out of the application in the future:

*   **Optimistic UI Updates:** Instead of relying purely on `router.refresh()` inside the Realtime channel listener, use the `payload.new` object provided by Supabase to directly update local React state. This makes the UI feel instant and avoids a server round-trip for data fetching.
*   **Event Debouncing:** If a game room has many rapid actions, debouncing the `router.refresh()` call in the Realtime listeners can prevent back-to-back database reads.
*   **Relational JSON Migration:** While `jsonb_set` is efficient, Supabase Realtime broadcasts the *entire* modified row. If `cardsSnapshot` grows very large, the Realtime egress payload will inflate. Migrating `cardsSnapshot` out of a JSON blob and into a dedicated `DrawnCard` relational table would allow Realtime to broadcast only the single changed card row.
*   **Presence & Cleanup:** Implement Supabase Presence to track active users. When the last user leaves a room, automatically trigger a lightweight background task to clean up the `Draw` state immediately, rather than waiting for the 3-day cron job.
*   **Edge Caching (Redis/KV):** For highly static room validation (e.g., "does this room code exist and is it locked?"), consider caching the initial room state in Vercel KV or an Edge cache to prevent hitting Postgres on every room join attempt.