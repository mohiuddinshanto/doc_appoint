
// ServiceSlot — Canonical Type System
// =============================================================================
// Single source of truth for every domain entity, API contract, store
// interface, and utility type used across the application.
//
// Naming conventions
// ──────────────────
// • PascalCase interfaces for domain objects and store shapes.
// • SCREAMING_SNAKE for literal-union sentinels.
// • `*Payload`  → data sent to the server.
// • `*State`    → Zustand slice (state-only, no actions).
// • `*Actions`  → Zustand slice (actions-only).
// • `*Store`    → full Zustand store type (State & Actions).
// =============================================================================

// ─── 1. Primitive Unions ─────────────────────────────────────────────────────

/** Visual / functional status of a single time slot. */
export type SlotStatus = "available" | "booked" | "blocked";

/** Lifecycle status of a customer appointment. */
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

/** Steps in the booking wizard flow. */
export type BookingStep = "service" | "slot" | "confirm" | "done";

// ─── 2. Core Domain Entities ─────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  description: string;
  /** Rounded session length shown on the card. */
  durationMinutes: number;
  price: number;
  /** ISO 4217 code, e.g. "USD". */
  currency: string;
  category: string;
  imageUrl?: string;
  providerId: string;
  providerName: string;
  rating: number;
  reviewCount: number;
  /** Tags used for full-text search beyond name/category. */
  tags?: string[];
  availableDays?: string[];
  availableTimes?: string[];
}

export interface TimeSlot {
  id: string;
  serviceId: string;
  /** ISO date string "YYYY-MM-DD". */
  date: string;
  /** 24-hour "HH:MM". */
  startTime: string;
  /** 24-hour "HH:MM". */
  endTime: string;
  status: SlotStatus;
  /** Populated when status === "booked". */
  appointmentId?: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  slotId: string;
  /**
   * Composite slot key used as the double-booking guard key.
   * Format: `${serviceId}::${date}::${slotId}`
   */
  compositeSlotKey: string;
  /** ISO date string "YYYY-MM-DD". */
  date: string;
  /** 24-hour "HH:MM". */
  startTime: string;
  /** 24-hour "HH:MM". */
  endTime: string;
  status: AppointmentStatus;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  totalPrice: number;
  currency: string;
  /** ISO timestamp when the booking was made. */
  bookedAt: string;
  /** ISO timestamp when the appointment was cancelled, if applicable. */
  cancelledAt?: string;
}

// ─── 3. Form Payload Types ────────────────────────────────────────────────────

/** Customer details captured in step 3 (confirm). */
export interface BookingFormValues {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
}

// ─── 4. Booking Store Types ───────────────────────────────────────────────────

/** What the user has selected so far in the wizard. */
export interface BookingSelection {
  service: Service | null;
  slot: TimeSlot | null;
  /** "YYYY-MM-DD" — chosen date, independent of slot. */
  date: string | null;
}

/**
 * Persisted booking state.
 *
 * `bookedSlotKeys` is a local UI cache and optimistic double-booking guard.
 * The backend/database is authoritative for actual availability.
 * Key format:  `${serviceId}::${date}::${slotId}`
 * Value:       appointmentId (string)
 *
 * Using a composite key (not just slotId) prevents false positives when
 * different services reuse the same slot ID for different dates.
 */
export interface BookingStoreState {
  appointments: Appointment[];
  bookedSlotKeys: Record<string, string>;

  // ── Transient wizard state (NOT persisted) ──
  step: BookingStep;
  selection: BookingSelection;
  isLoading: boolean;
  error: string | null;
}

export interface BookingStoreActions {
  // Wizard navigation
  setStep: (step: BookingStep) => void;
  selectService: (service: Service) => void;
  selectDate: (date: string) => void;
  selectSlot: (slot: TimeSlot) => void;
  clearSelection: () => void;

  // Core booking logic
  bookSlot: (payload: BookingFormValues) => Promise<Appointment | null>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  /** Reload the signed-in user's appointment history from the backend. */
  loadAppointments: () => Promise<void>;
  /** Reload globally booked slots for one service and date. */
  loadAvailability: (serviceId: string, date: string) => Promise<void>;

  // Computed / derived helpers (called synchronously inside components)
  isSlotBooked: (compositeKey: string) => boolean;

  /** Wipe all persisted data — useful for "logout" or testing. */
  reset: () => void;
}

export type BookingStore = BookingStoreState & BookingStoreActions;

// ─── 5. Service Store Types ───────────────────────────────────────────────────

export interface ServiceStoreState {
  /** Slot lists keyed by `${serviceId}::${date}`. */
  slotsByKey: Record<string, TimeSlot[]>;
}

export interface ServiceStoreActions {
  setSlots: (serviceId: string, date: string, slots: TimeSlot[]) => void;
}

export type ServiceStore = ServiceStoreState & ServiceStoreActions;
