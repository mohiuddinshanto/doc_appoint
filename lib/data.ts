/**
 * @file lib/data.ts — Seed data & slot helpers (replaces the real API layer).
 *
 * In production, replace `SEED_SERVICES` with a fetch to GET /services and
 * `buildSlots` with a fetch to GET /services/:id/slots?date=YYYY-MM-DD.
 */

import type { TimeSlot } from "@/types";

// =============================================================================
// SEED SERVICES
// =============================================================================


// =============================================================================
// SLOT HELPERS
// =============================================================================

/** Builds a full day of hourly slots for a service + date (simulated API). */
export function buildSlots(serviceId: string, date: string): TimeSlot[] {
  const hours = [9, 10, 11, 13, 14, 15, 16, 17];
  return hours.map((h) => ({
    id: `slot_${serviceId}_${h}h`,
    serviceId,
    date,
    startTime: `${String(h).padStart(2, "0")}:00`,
    endTime: `${String(h + 1).padStart(2, "0")}:00`,
    status: "available" as const,
  }));
}

/** Today as "YYYY-MM-DD". */
export const TODAY = new Date().toISOString().slice(0, 10);

/** The next 7 days (including today) as ISO date strings. */
export function getNext7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

/** Formats an ISO date ("2026-08-24") for display, e.g. "Mon, Aug 24". */
export function formatIsoDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
