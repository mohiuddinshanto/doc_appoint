//appointment booking-এর পুরো process manage করার জন্য Zustand Store তৈরি করা হয়েছে। এই Store-এ appointment booking-এর বিভিন্ন step, selection, booked slots, এবং appointment history manage করা হয়। এছাড়া, localStorage-এর মাধ্যমে multi-tab synchronization নিশ্চিত করা হয়।



import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
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


/** localStorage key. Increment `STORE_VERSION` when the shape changes. */
const STORAGE_KEY = "serviceslot-booking-v2";
const STORE_VERSION = 2;


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



export const useBookingStore = create<BookingStore>()(

  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...INITIAL_STATE,

        setStep: (step: BookingStep) => set({ step }),

        selectService: (service: Service) =>
          set({
            selection: { ...EMPTY_SELECTION, service, date: TODAY },
            step: "slot",
            error: null,
          }),

        selectDate: (date: string) =>
          set((s) => ({
            selection: { ...s.selection, date, slot: null },
            error: null,
          })),


        selectSlot: (slot: TimeSlot) =>
          set((s) => ({
            selection: { ...s.selection, slot },
            step: "confirm",
            error: null,
          })),


        clearSelection: () =>
          set({
            selection: EMPTY_SELECTION,
            step: "service",
            error: null,
            isLoading: false,
          }),


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
              const { [compositeKey]: _pendingLock, ...bookedSlotKeys } = s.bookedSlotKeys;
              return { bookedSlotKeys, isLoading: false, error: extractMessage(err) };
            });

            return null;
          }
        },


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
            // এর মাধ্যমে আমরা বুকিং বাতিল করার সময় লোকাল স্টোরেজে বুকিং স্লট লক করে সরিয়ে দেই যাতে অন্য কেও বুকিং করে ফেলতে না পারে। 
            const { [compositeSlotKey]: removed, ...restKeys } = s.bookedSlotKeys;
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

        loadAppointments: async (): Promise<void> => {
          set({ isLoading: true, error: null });

          try {
            const appointments = await _getAppointmentsApi();
            const bookedSlotKeys = Object.fromEntries(
              appointments
                .filter((appointment) => appointment.status === "upcoming")
                .map((appointment) => [appointment.compositeSlotKey, appointment.id])
            );

            set({ appointments, bookedSlotKeys, isLoading: false, error: null });
          } catch (err) {
            set({ isLoading: false, error: extractMessage(err) });
          }
        },

        // যদি compositeKey এর মাধ্যমে কোন স্লট ইতিমধ্যেই বুক করা থাকে কিনা তা চেক করা হয়।
        isSlotBooked: (compositeKey: string): boolean =>
          Boolean(get().bookedSlotKeys[compositeKey]),

        // কোন appointment ওই slot-টা বুক করেছে, সেই appointment-টা বের করা হয় compositeKey এর মাধ্যমে। যদি appointment না থাকে, তাহলে undefined রিটার্ন করা হয়।
        getAppointmentByKey: (compositeKey: string): Appointment | undefined => {
          const appointmentId = get().bookedSlotKeys[compositeKey];
          if (!appointmentId) return undefined;
          return get().appointments.find((a) => a.id === appointmentId);
        },

        // slot-এর স্ট্যাটাস অনুযায়ী appointment-গুলোকে filter করা হয় এবং তারপরে তারিখ এবং সময় অনুযায়ী sort করা হয়।
        getUpcomingAppointments: (): Appointment[] =>
          get()
            .appointments.filter((a) => a.status === "upcoming")
            .sort(
              (a, b) =>
                new Date(`${a.date}T${a.startTime}`).getTime() -
                new Date(`${b.date}T${b.startTime}`).getTime()
            ),


            
        //a is Appointment এইটার মাধ্যমে TypeScript কে বলা হচ্ছে যে এই condition যদি true হয়, তাহলে ধরে নাও a হলো Appointment type-এর object.


        // getPastAppointments ফাংশনটি appointment-গুলোকে filter করে যেগুলো "completed" বা "cancelled" স্ট্যাটাসে আছে এবং তারপর তাদের bookedAt তারিখ অনুযায়ী descending order-এ sort করে।
        getPastAppointments: (): Appointment[] =>
          get()
            .appointments.filter(
              (a): a is Appointment =>
                a.status === "completed" || a.status === "cancelled"
            )
            .sort(
              (a, b) =>
                new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
            ),

        //serviceId মানে হলো serviceId দিয়ে একই ডাক্তার/service-এর সাথে সম্পর্কিত কতগুলো appointment আছে সেটা বের করা
        getAppointmentsByService: (serviceId: string): Appointment[] =>
          get().appointments.filter((a) => a.serviceId === serviceId),



        setError: (error: string | null) => set({ error }),
        setLoading: (isLoading: boolean) => set({ isLoading }),

        reset: () =>
          set({
            ...INITIAL_STATE,

            appointments: [],
            bookedSlotKeys: {},
          }),
      }),


      {
        name: STORAGE_KEY,

        partialize: (state) => ({
          appointments: state.appointments,
          bookedSlotKeys: state.bookedSlotKeys,
        }),


        version: STORE_VERSION,


        migrate: (persisted: unknown, storedVersion: number): Partial<BookingStore> => {
          let data = persisted as {
            appointments?: Appointment[];
            bookedSlotKeys?: Record<string, string>;
          };




          // LocalStorage-এর data যদি Version 2-এর আগের হয়, তাহলে migration করা হয়। Version 2-এ আমরা compositeSlotKey field যোগ করেছি। তাই আমরা appointments-এর মধ্যে compositeSlotKey generate করি এবং bookedSlotKeys map update করি।
          if (storedVersion < 2) {
            const bookedSlotKeys: Record<string, string> = {};
            for (const appt of data.appointments ?? []) {
              if (appt.status === "upcoming") {

                const key =
                  appt.compositeSlotKey ??
                  buildSlotKey(appt.serviceId, appt.date, appt.slotId);
                bookedSlotKeys[key] = appt.id;

                if (!appt.compositeSlotKey) {
                  appt.compositeSlotKey = key;
                }
              }
            }
            data = { ...data, bookedSlotKeys };
          }

          return {
            appointments: data.appointments ?? [],
            bookedSlotKeys: data.bookedSlotKeys ?? {},
          };
        },

      }
    )
  )
);


// Zustand store থেকে নির্দিষ্ট নির্দিষ্ট data বের করার ছোট function লিখা হয়। এগুলোকে selector বলা হয়। এগুলো ব্যবহার করে component-গুলোকে শুধু প্রয়োজনীয় data access করতে সাহায্য করে এবং unnecessary re-renders কমায়।

export const selectStep = (s: BookingStore): BookingStep => s.step;
export const selectSelection = (s: BookingStore): BookingSelection => s.selection;
export const selectService = (s: BookingStore): Service | null => s.selection.service;
export const selectDate = (s: BookingStore): string | null => s.selection.date;
export const selectSelectedSlot = (s: BookingStore): TimeSlot | null => s.selection.slot;
export const selectAppointments = (s: BookingStore): Appointment[] => s.appointments;
export const selectBookedSlotKeys = (s: BookingStore): Record<string, string> => s.bookedSlotKeys;
export const selectIsLoading = (s: BookingStore): boolean => s.isLoading;
export const selectError = (s: BookingStore): string | null => s.error;


export const selectUpcomingCount = (s: BookingStore): number =>
  s.appointments.filter((a) => a.status === "upcoming").length;

// এইখানে আমরা window.addEventListener ব্যবহার করে localStorage-এর পরিবর্তনগুলোর জন্য listener যোগ করি। যখন অন্য tab বা window-এ localStorage update হয়, তখন এই listener trigger হয় এবং আমাদের Zustand store update হয়। এটি multi-tab synchronization নিশ্চিত করে।

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || event.newValue === null) return;
    try {
      const { state } = JSON.parse(event.newValue) as {
        state: { appointments: Appointment[]; bookedSlotKeys: Record<string, string> };
      };

      useBookingStore.setState((current) => ({
        appointments: state.appointments ?? current.appointments,
        bookedSlotKeys: state.bookedSlotKeys ?? current.bookedSlotKeys,
      }));
    } catch {

    }
  });
}



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
    throw new Error("Unable to create the appointment.");
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
