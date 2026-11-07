import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "DocAppoint - Doctor Appointment & Healthcare Booking",
  description:
    "Effortlessly manage service bookings with real-time slot availability, ensuring seamless scheduling and cancellations for users seeking efficient appointment management.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f7f8fc] text-[#0b1020] font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 600,
              background: "#0b1020",
              color: "#fff",
              padding: "12px 20px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
