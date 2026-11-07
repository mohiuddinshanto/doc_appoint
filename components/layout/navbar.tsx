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
      <header className="sticky top-3.5 z-50 mx-auto w-[min(1120px,calc(100%-24px))] sm:w-[min(1120px,calc(100%-32px))] rounded-full border border-white/80 bg-white/80 shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_-8px_rgba(40,40,120,0.10)] backdrop-blur-xl transition-all">
        <div className="flex h-[56px] sm:h-[60px] items-center justify-between px-3.5 sm:px-5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer">
            <div className="flex h-[32px] w-[32px] sm:h-[34px] sm:w-[34px] items-center justify-center rounded-[10px] sm:rounded-[11px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_6px_16px_-4px_rgba(91,91,240,0.6)]">
              <LuStethoscope size={17} />
            </div>
            <span className="text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#0b1020] leading-none whitespace-nowrap">
              DocAppoint
            </span>
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* My Appointments Pill (Hidden on mobile < sm, visible inside mobile drawer) */}
            <div className="hidden sm:inline-flex relative">
              <Link
                href="/appointments"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive("/appointments")
                    ? "border-[#5b5bf0] bg-[#eef0ff] text-[#5b5bf0]"
                    : "border-[#e4e7f2] bg-white text-[#0b1020] hover:border-[#5b5bf0] hover:text-[#5b5bf0]"
                }`}
              >
                <CalendarCheck size={16} className="text-[#5b5bf0]" />
                <span>My Appointments</span>
              </Link>
              {mounted && upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#5b5bf0] to-[#22d3ee] px-1 text-[10px] font-extrabold text-white">
                  {upcomingCount}
                </span>
              )}
            </div>

            {/* Auth Button or User Profile */}
            {mounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#e4e7f2] bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-[#0b1020] hover:border-[#5b5bf0] transition-all whitespace-nowrap"
                >
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#5b5bf0] text-[11px] sm:text-xs font-bold text-white">
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
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#0b1020] px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,16,32,0.6)] transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                <LuLogIn size={14} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-[34px] w-[34px] sm:h-[38px] sm:w-[38px] items-center justify-center rounded-full bg-[#f0f2f9] text-[#0b1020] lg:hidden hover:bg-[#e4e7f2] transition-colors shrink-0"
            >
              {mobileOpen ? <LuX size={17} /> : <LuMenu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="absolute top-[64px] left-0 right-0 rounded-[24px] border border-[#e4e7f2] bg-white/95 p-4 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)] backdrop-blur-xl lg:hidden animate-fade">
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

              {/* My Appointments in mobile drawer */}
              <Link
                href="/appointments"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive("/appointments")
                    ? "bg-[#eef0ff] text-[#5b5bf0]"
                    : "text-[#687089] hover:bg-[#f0f2f9] hover:text-[#0b1020]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  My Appointments
                </span>
                {mounted && upcomingCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-[#5b5bf0] to-[#22d3ee] px-1.5 text-[11px] font-bold text-white">
                    {upcomingCount}
                  </span>
                )}
              </Link>

              {/* Mobile Drawer Auth Actions */}
              <div className="mt-2 border-t border-[#f0f2f9] pt-2">
                {mounted && isAuthenticated && user ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#99a0b8]">Signed in as</p>
                      <p className="truncate text-xs font-bold text-[#0b1020]">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        void handleSignOut();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <LuLogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b1020] py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#5b5bf0] transition-colors"
                  >
                    <LuLogIn size={15} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
