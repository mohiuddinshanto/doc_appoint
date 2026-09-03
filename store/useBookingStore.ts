//appointment booking-এর পুরো process manage করার জন্য Zustand Store তৈরি করা হয়েছে। এই Store-এ store আছে  [appointments, bookedSlotKeys, step, selection, isLoading, error]

// এবং action আছে [setStep(), selectService(), selectDate(), selectSlot(), clearSelection(),
//  bookSlot(), cancelAppointment(), loadAppointments(), loadAvailability(),
//  isSlotBooked(), reset()]। এই state এবং action গুলা useBookingStore() hook এর মাধ্যমে access করা যাবে।


import { create } from "zustand";
import { TODAY } from "../lib/data";
import type {
  Appointment,
  AppointmentStatus,
  BookingFormValues,
  BookingSelection,
  BookingStep,
  BookingStore,
  Service,
  TimeSlot,
} from "../types";
import { getBackendToken } from "../lib/auth-client";


export function buildSlotKey(
  serviceId: string,
  date: string,
  slotId: string
): string {
  return `${serviceId}::${date}::${slotId}`;
}

/** এরর মেসেজ পাঠানো */
function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string" && err.length > 0) return err;
  return "An unexpected error occurred. Please try again.";
}

// এমটি সিলেকশন অবজেক্ট যা রিসেটের সময় ব্যবহার করা হবে

const EMPTY_SELECTION: BookingSelection = {
  service: null,
  slot: null,
  date: null,
};

const INITIAL_STATE = {
  appointments: [] as Appointment[],
  bookedSlotKeys: {} as Record<string, string>,
  step: "service" as BookingStep,
  selection: EMPTY_SELECTION,
  isLoading: false,
  error: null as string | null,
};



export const useBookingStore = create<BookingStore>()((set, get) => ({
  ...INITIAL_STATE,
  // setStep() দিয়ে user এখন booking-এর কোন অবস্থায় আছে, সেটা পরিবর্তন করার জন্য ডিফাইন করেছি।
  // যেমন service → slot → confirm → done
  setStep: (step: BookingStep) => set({ step }),


  //selectService()-এর কাজ হলো user যে service/doctor নির্বাচন করেছে, সেটা selection-এর মধ্যে রাখা এবং booking flow-কে slot step-এ নিয়ে যাওয়ার জন্য।
  selectService: (service: Service) =>
    set({
      selection: { ...EMPTY_SELECTION, service, date: TODAY },
      step: "slot",
      error: null,
    }),


  //selectDate()-এর কাজ হলো user যে date নির্বাচন করেছে, সেটা selection-এর মধ্যে রাখা এবং নতুন date নির্বাচন করলে আগের selected slot-টি reset করা।
  selectDate: (date: string) =>
    set((s) => ({
      selection: { ...s.selection, date, slot: null },
      error: null,
    })),


  //selectSlot()-এর কাজ হলো user যে time slot নির্বাচন করেছে, সেটা selection-এর মধ্যে রাখা এবং booking flow-কে confirm step-এ নিয়ে যাওয়া।
  selectSlot: (slot: TimeSlot) =>
    set((s) => ({
      selection: { ...s.selection, slot },
      step: "confirm",
      error: null,
    })),

  //clearSelection()-এর কাজ হলো বর্তমান booking-এর service, date ও slot-এর selection মুছে দিয়ে booking flow-কে আবার শুরুতে ফিরিয়ে দেওয়া। এটি Confirm করার আগে Cancel করলে বা booking শেষ হওয়ার পর নতুন booking শুরু করতে চাইলে ব্যবহার করা হয়।
  clearSelection: () =>
    set({
      selection: EMPTY_SELECTION,
      step: "service",
      error: null,
      isLoading: false,
    }),



  // bookSlot()-এর কাজ হলো user-এর selected service, date ও time slot ব্যবহার করে appointment তৈরি করা।
  // সাথে সাথে check করা হয় যে service, date ও slot selection আছে কিনা। যদি না থাকে, তাহলে error দেখানো হয়। তারপর bookedSlotKeys-এর মধ্যে compositeKey check করা হয়। যদি ইতিমধ্যেই booked থাকে, তাহলে error দেখানো হয়। তারপর temporaryId দিয়ে bookedSlotKeys update করা হয় যাতে অন্য user একই সময়ে এই slot বুক করতে না পারে। তারপর _createAppointmentApi() function call করে appointment তৈরি করা হয়। যদি appointment সফলভাবে তৈরি হয়, তাহলে appointments state update করা হয় এবং bookedSlotKeys-এর মধ্যে compositeKey-এর সাথে appointment ID রাখা হয়। যদি appointment creation ব্যর্থ হয়, তাহলে bookedSlotKeys থেকে temporaryId remove করা হয় এবং error দেখানো হয়। এছাড়া loadAvailability() function call করে backend থেকে সর্বশেষ slot availability নিয়ে আসে।

  bookSlot: async (formValues: BookingFormValues): Promise<Appointment | null> => {
    const { selection, bookedSlotKeys } = get();
    const { service, slot, date } = selection;


    if (!service || !slot || !date) {
      set({ error: "Please select a service, date, and time slot before booking." });
      return null;
    }


    // যদি সার্ভিস এবং স্লোট ইতিমধ্যেই বুক করা থাকে, তাহলে এরর মেসেজ দেখানো হবে
    const compositeKey = buildSlotKey(service.id, date, slot.id);

    if (bookedSlotKeys[compositeKey]) {
      set({
        error:
          "This slot is no longer available. It may have just been booked by someone else. please choose another time.",
      });
      return null;
    }


    // এই temporaryId শুধু আমাদের frontend-এর জন্য একটি সাময়িক lock। যেন অন্য user একই সময়ে এই slot বুক করতে না পারে। আসল appointment ID MongoDB তৈরি করবে এবং API response-এর মাধ্যমে দেবে।
    const temporaryId = "__pending_booking__";
    set((s) => ({
      bookedSlotKeys: { ...s.bookedSlotKeys, [compositeKey]: temporaryId },
      isLoading: true,
      error: null,
    }));

    try {
      const appointment = await _createAppointmentApi({ service, slot, date, compositeKey, formValues });

      set((s) => {
        return {
          appointments: [...s.appointments, appointment],
          bookedSlotKeys: { ...s.bookedSlotKeys, [compositeKey]: appointment.id },
          step: "done",
          isLoading: false,
          error: null,
        };
      });

      return appointment;
    } catch (err) {

      // যদি বুকিং ব্যর্থ হয়, এবং অন্য কেও বুকিং করে ফেলে সেই সময় অতঃপর আমরা দেখি যে আমাদের অস্থায়ী লক এখনও আছে কিনা। যদি না থাকে, তাহলে আমরা শুধু এরর দেখাই। 
      set((s) => {
        if (s.bookedSlotKeys[compositeKey] !== temporaryId) {
          return { isLoading: false, error: extractMessage(err) };
        }
        // যদি আমাদের অস্থায়ী লক এখনও আছে, তাহলে আমরা এটিকে সরিয়ে দেই যাতে অন্য কেও বুকিং করে ফেলে সেই সময় আর উক্ত উজারকে আমরা  এরর দেখাই।
        const bookedSlotKeys = { ...s.bookedSlotKeys };
        delete bookedSlotKeys[compositeKey];
        return { bookedSlotKeys, isLoading: false, error: extractMessage(err) };
      });

      //booking ব্যর্থ হওয়ার পর backend থেকে ওই date-এর সর্বশেষ slot availability আবার এনে UI-কে সঠিক অবস্থায় নেওয়া।
      void get().loadAvailability(service.id, date);

      return null;
    }
  },

  //cancelAppointment()-এর কাজ হলো আগে থেকে বুক করা upcoming appointment বাতিল করা। Appointment-এর status cancelled করে, সেই slot-কে আবার available করা এবং API-তে update পাঠানো। যদি API ব্যর্থ হয়, তাহলে আমরা আবার সেই slot-কে booked হিসেবে ফিরিয়ে দেই এবং error দেখাই।
  cancelAppointment: async (appointmentId: string): Promise<boolean> => {
    const appointment = get().appointments.find((a) => a.id === appointmentId);


    if (!appointment) {
      set({ error: `Appointment "${appointmentId}" was not found.` });
      return false;
    }


    if (appointment.status !== "upcoming") {
      set({
        error: `Only upcoming appointments can be cancelled. This one is "${appointment.status}".`,
      });
      return false;
    }

    const { compositeSlotKey } = appointment;

    set((s) => {
      // এর মাধ্যমে আমরা বুকিং বাতিল করার সময় লোকাল স্টোরেজে বুকিং স্লট লক করে সরিয়ে দেই যাতে অন্য কেও বুকিং করে ফেলতে না পারে। তাই প্রথমে সবগুলা কপি করে restKeys তে রাখি এবং তারপর compositeSlotKey কে delete করি। তারপর আমরা appointments-এর মধ্যে সেই appointment-এর status cancelled করে দেই।
      const restKeys = { ...s.bookedSlotKeys };
      delete restKeys[compositeSlotKey];
      return {
        appointments: s.appointments.map((a) =>
          a.id === appointmentId
            ? ({
              ...a,
              status: "cancelled" as AppointmentStatus,
              cancelledAt: new Date().toISOString(),
            } satisfies Appointment)
            : a
        ),
        bookedSlotKeys: restKeys,
        isLoading: true,
        error: null,
      };
    });

    try {
      await _cancelAppointmentApi(appointmentId);
      set({ isLoading: false });
      return true;
    } catch (err) {

      //যদি API কল ব্যর্থ হয়, তাহলে আমরা আবার সেই স্লোট কে আবার ফিরিয়ে আনি যেন চাইলে অন্য কেও বুকিং করতে পারে।
      set((s) => ({
        appointments: s.appointments.map((a) =>
          a.id === appointmentId
            ? ({ ...a, status: "upcoming" as AppointmentStatus, cancelledAt: undefined } satisfies Appointment)
            : a
        ),
        bookedSlotKeys: { ...s.bookedSlotKeys, [compositeSlotKey]: appointmentId },
        isLoading: false,
        error: extractMessage(err),
      }));
      return false;
    }
  },


  //loadAppointments() ব্যবহার করা হয়েছে backend থেকে বর্তমান user-এর সব appointment এনে Zustand-এর appointments state-এ রাখার জন্য, যাতে My Appointments পেজে সেগুলো দেখানো যায়।
  loadAppointments: async (): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const appointments = await _getAppointmentsApi();
      // এই response-এ শুধুমাত্র বর্তমান user-এর appointments-এর data থাকে।
      set({ appointments, isLoading: false, error: null });
    } catch (err) {
      set({ isLoading: false, error: extractMessage(err) });
    }
  },


  //Backend থেকে নির্দিষ্ট service ও date-এর booked slot নিয়ে আসে এবং সেই data-এর সাথে frontend-এ চলমান __pending_booking__ slot-গুলোও রেখে bookedSlotKeys update করে।
  loadAvailability: async (serviceId: string, date: string): Promise<void> => {
    try {
      const bookedSlotKeys = await _getAvailabilityApi(serviceId, date);
      set((state) => {
        // Keep an optimistic lock while its POST request is in flight.
        const pendingKeys = Object.fromEntries(
          // প্রথম value (key) দরকার নেই
          // দ্বিতীয় value-টা id নামে নেওয়া হচ্ছে
          Object.entries(state.bookedSlotKeys).filter(([, id]) => id === "__pending_booking__")
        );
        return { bookedSlotKeys: { ...bookedSlotKeys, ...pendingKeys } };
      });
    } catch (err) {
      set({ error: extractMessage(err) });
    }
  },

  // যদি compositeKey এর মাধ্যমে কোন স্লট ইতিমধ্যেই বুক করা থাকে কিনা তা চেক করা হয়।
  isSlotBooked: (compositeKey: string): boolean =>
    Boolean(get().bookedSlotKeys[compositeKey]),


  reset: () =>
    set({
      ...INITIAL_STATE,

      appointments: [],
      bookedSlotKeys: {},
    }),
}));


// Zustand store থেকে নির্দিষ্ট নির্দিষ্ট data বের করার ছোট function লিখা হয়। এগুলোকে selector বলা হয়। এগুলো ব্যবহার করে component-গুলোকে শুধু প্রয়োজনীয় data access করতে সাহায্য করে এবং unnecessary re-renders কমায়।

export const selectStep = (s: BookingStore): BookingStep => s.step;
export const selectSelection = (s: BookingStore): BookingSelection => s.selection;
export const selectAppointments = (s: BookingStore): Appointment[] => s.appointments;
export const selectError = (s: BookingStore): string | null => s.error;


export const selectUpcomingCount = (s: BookingStore): number =>
  s.appointments.filter((a) => a.status === "upcoming").length;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function _createAppointmentApi({
  service,
  slot,
  date,
  compositeKey,
  formValues,
}: {
  service: Service;
  slot: TimeSlot;
  date: string;
  compositeKey: string;
  formValues: BookingFormValues;
}): Promise<Appointment> {
  const appointmentPayload = {
    serviceId: service.id,
    serviceName: service.name,
    providerId: service.providerId,
    providerName: service.providerName,
    slotId: slot.id,
    compositeSlotKey: compositeKey,
    date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "upcoming" as AppointmentStatus,
    customerName: formValues.customerName,
    customerEmail: formValues.customerEmail,
    customerPhone: formValues.customerPhone,
    notes: formValues.notes,
    totalPrice: service.price,
    currency: service.currency,
    bookedAt: new Date().toISOString(),
  };

  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/appoints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentPayload),
  });
  if (!res.ok) {
    let message = "Unable to create the appointment.";
    try {
      const data = (await res.json()) as { message?: unknown };
      if (typeof data.message === "string" && data.message) message = data.message;
    } catch {
      // Use the default message for an empty or non-JSON response.
    }
    throw new Error(message);
  }

  const data = await res.json();
  return { ...appointmentPayload, id: data._id };
}

async function _cancelAppointmentApi(appointmentId: string): Promise<void> {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/appoints/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status: "cancelled" }),
  });

  if (!res.ok) {
    let message = "Unable to cancel the appointment.";
    try {
      const data = (await res.json()) as { message?: unknown };
      if (typeof data.message === "string" && data.message) message = data.message;
    } catch {
      // Ignore invalid or empty JSON error responses.
    }
    throw new Error(message);
  }
}

async function _getAppointmentsApi(): Promise<Appointment[]> {
  const token = await getBackendToken();
  const res = await fetch(`${BACKEND_URL}/appoints`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Unable to load your appointments.");
  }

  const data: unknown = await res.json();
  const records = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: unknown[] }).data
      : data && typeof data === "object" && Array.isArray((data as { appointments?: unknown }).appointments)
        ? (data as { appointments: unknown[] }).appointments
        : [];

  return records.map((record) => normalizeAppointment(record));
}

async function _getAvailabilityApi(
  serviceId: string,
  date: string
): Promise<Record<string, string>> {
  const params = new URLSearchParams({ serviceId, date });
  const res = await fetch(`${BACKEND_URL}/appoints/availability?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    let message = "Unable to load slot availability.";
    try {
      const data = (await res.json()) as { message?: unknown };
      if (typeof data.message === "string" && data.message) message = data.message;
    } catch {
      // Use the default message for an empty or non-JSON response.
    }
    throw new Error(message);
  }

  const data = (await res.json()) as { bookedSlotKeys?: unknown };
  const keys = Array.isArray(data.bookedSlotKeys) ? data.bookedSlotKeys : [];
  return Object.fromEntries(
    keys
      .filter((key): key is string => typeof key === "string")
      .map((key) => [key, "__booked__"])
  );
}

function normalizeAppointment(record: unknown): Appointment {
  const appointment = record as Partial<Appointment> & { _id?: unknown };
  const id = appointment.id ?? appointment._id;

  if (typeof id !== "string") {
    throw new Error("The appointments response contains an invalid appointment ID.");
  }

  return {
    ...appointment,
    id,
    compositeSlotKey:
      appointment.compositeSlotKey ??
      buildSlotKey(appointment.serviceId ?? "", appointment.date ?? "", appointment.slotId ?? ""),
  } as Appointment;
}
