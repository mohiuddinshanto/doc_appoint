import { LuCalendar, LuShieldCheck, LuStethoscope } from "react-icons/lu";

const steps = [
  { icon: LuStethoscope, title: "1. Choose a Doctor", text: "Search by specialty and view doctor details." },
  { icon: LuCalendar, title: "2. Pick Date & Time", text: "Choose an available time that works for you." },
  { icon: LuShieldCheck, title: "3. Confirm Booking", text: "Your appointment is confirmed instantly." },
];

export function HowItWorks() {
  return (
    <section className="mt-20 border-t pt-12">
      <h2 className="mb-8 text-center text-3xl font-bold">How It Works</h2>
      <div className="grid gap-5 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl bg-white p-6 text-center shadow-sm">
            <Icon className="mx-auto mb-3 text-indigo-600" size={28} />
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
