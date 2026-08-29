import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceSlot Book appointments instantly",
  description:
    "Effortlessly manage service bookings with real-time slot availability, ensuring seamless scheduling and cancellations for users seeking efficient appointment management.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
