"use client";

import { useState } from "react";
import {
  Badge,
  Link,
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  LuCalendarCheck as CalendarCheck,
  LuUser,
  LuLogOut,
  LuStethoscope,
  LuLogIn,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useMounted } from "@/hooks/use-mounted";
import { selectUpcomingCount, useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/auth/auth-modal";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/", label: "Doctors & Services" },
  { href: "/booking", label: "Book Appointment" },
] as const;

export function AppNavbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const upcomingCount = useBookingStore(selectUpcomingCount);

  const { user, isAuthenticated, logout } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut();
    logout();
    toast.success("Signed out successfully.");
  };

  return (
    <>
      <HeroNavbar
        isBordered
        classNames={{
          base: "bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/80 shadow-sm",
          wrapper: "max-w-6xl px-4 sm:px-6",
        }}
      >
        {/* লোগো এবং ব্র্যান্ড নামের জন্য NavbarBrand ব্যবহার করা হয়েছে। ব্র্যান্ড নাম "DocAppoint" এবং সাবটাইটেল "Health & Wellness" দেখানো হয়েছে। */}
        <NavbarBrand className="gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <LuStethoscope size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-gray-900 leading-none">
                DocAppoint
              </span>
              <span className="text-[10px] font-medium text-indigo-600 tracking-wide uppercase">
                Health & Wellness
              </span>
            </div>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="center" className="hidden sm:flex gap-1">
          {NAV_ITEMS.map(({ href, label }) => (
            <NavbarItem key={href} isActive={isActive(href)}>
              <Link
                href={href}
                size="sm"
                className={`rounded-lg px-3.5 py-2 font-medium transition-all ${
                  isActive(href)
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="gap-3">
          <NavbarItem>
            <Badge
              content={mounted ? upcomingCount : 0}
              color="primary"
              shape="circle"
              size="sm"
              isInvisible={!mounted || upcomingCount === 0}
            >
              <Link
                href="/appointments"
                size="sm"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive("/appointments")
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CalendarCheck size={16} />
                <span className="hidden sm:inline">My Appointments</span>
              </Link>
            </Badge>
          </NavbarItem>

          <NavbarItem>
            {mounted && isAuthenticated && user ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-gray-50/80"
                  >
                    <Avatar
                      name={user.name}
                      size="sm"
                      className="bg-indigo-600 text-white font-bold text-xs"
                    />
                    <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold text-xs text-gray-400">Signed in as</p>
                    <p className="font-bold text-sm text-gray-800">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<LuLogOut size={16} />}
                    onPress={handleSignOut}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                color="primary"
                size="sm"
                variant="solid"
                startContent={<LuLogIn size={16} />}
                className="font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow transition-all rounded-xl"
                onPress={() => setAuthModalOpen(true)}
              >
                Sign In
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="sm:hidden gap-1">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              aria-label="Open navigation menu"
              className="text-gray-700 rounded-xl"
              onPress={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroNavbar>

      {mobileOpen && (
        <div className="sm:hidden border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-md">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onPress={() => setMobileOpen(false)}
                  className={`rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/appointments"
                onPress={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive("/appointments")
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <CalendarCheck size={16} />
                My Appointments
              </Link>
            </nav>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </>
  );
}

