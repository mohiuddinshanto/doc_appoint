"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuCalendarCheck as CalendarCheck,
  LuLogOut,
  LuStethoscope,
  LuLogIn,
  LuMenu,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { useMounted } from "@/hooks/use-mounted";
import { selectUpcomingCount, useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/auth/auth-modal";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Book Appointment" },
] as const;

export function AppNavbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const upcomingCount = useBookingStore(selectUpcomingCount);

  const { user, isAuthenticated, logout } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut();
    logout();
    useBookingStore.getState().reset();
    toast.success("Signed out successfully.");
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-3.5 z-50 mx-auto w-[min(1120px,calc(100%-32px))] rounded-full border border-white/80 bg-white/75 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] backdrop-blur-xl transition-all">
        <div className="flex h-[60px] items-center justify-between px-3 sm:px-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_6px_16px_-4px_rgba(91,91,240,0.6)]">
              <LuStethoscope size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-extrabold tracking-tight text-[#0b1020] leading-none">
                DocAppoint
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#eef0ff] text-[#5b5bf0]"
                      : "text-[#687089] hover:bg-[#f0f2f9] hover:text-[#0b1020]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* My Appointments Pill */}
            <div className="relative">
              <Link
                href="/appointments"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  isActive("/appointments")
                    ? "border-[#5b5bf0] bg-[#eef0ff] text-[#5b5bf0]"
                    : "border-[#e4e7f2] bg-white text-[#0b1020] hover:border-[#5b5bf0] hover:text-[#5b5bf0]"
                }`}
              >
                <CalendarCheck size={16} className="text-[#5b5bf0]" />
                <span className="hidden sm:inline">My Appointments</span>
              </Link>
              {mounted && upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#5b5bf0] to-[#22d3ee] px-1 text-[10px] font-extrabold text-white">
                  {upcomingCount}
                </span>
              )}
            </div>

            {/* Auth Button or User Dropdown */}
            {mounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[#e4e7f2] bg-white px-3 py-1.5 text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5b5bf0] text-xs font-bold text-white">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#e4e7f2] bg-white p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-[#f0f2f9]">
                      <p className="text-[11px] text-[#99a0b8]">Signed in as</p>
                      <p className="text-xs font-bold text-[#0b1020] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LuLogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#0b1020] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,16,32,0.6)] transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:-translate-y-0.5"
              >
                <LuLogIn size={15} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f0f2f9] text-[#0b1020] lg:hidden hover:bg-[#e4e7f2] transition-colors"
            >
              {mobileOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="absolute top-[68px] left-0 right-0 rounded-[24px] border border-[#e4e7f2] bg-white/95 p-4 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)] backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1.5">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive(href)
                      ? "bg-[#eef0ff] text-[#5b5bf0]"
                      : "text-[#687089] hover:bg-[#f0f2f9] hover:text-[#0b1020]"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/appointments"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive("/appointments")
                    ? "bg-[#eef0ff] text-[#5b5bf0]"
                    : "text-[#687089] hover:bg-[#f0f2f9] hover:text-[#0b1020]"
                }`}
              >
                <CalendarCheck size={16} />
                My Appointments {mounted && upcomingCount > 0 && `(${upcomingCount})`}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
