"use client";

import React, { useState } from "react";
import { LuMail, LuLock, LuUser, LuLogIn, LuUserPlus, LuX, LuStethoscope } from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to sign in. Check credentials.");
      } else {
        const userId = res.data?.user?.id;
        if (!userId) {
          throw new Error("Sign-in succeeded but the server did not return a user ID.");
        }

        const loggedInUser = {
          id: userId,
          name: res.data?.user?.name || email.split("@")[0],
          email: res.data?.user?.email || email,
        };

        setAuth(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}!`);
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed.");
      } else {
        const userId = res.data?.user?.id;
        if (!userId) {
          throw new Error("Registration succeeded but the server did not return a user ID.");
        }

        const newUser = {
          id: userId,
          name: name,
          email: email,
        };

        setAuth(newUser);
        toast.success(`Account created! Welcome, ${name}!`);
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1020]/45 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-[420px] rounded-[32px] bg-white p-7 sm:p-9 shadow-[0_24px_60px_-12px_rgba(40,40,120,0.25)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#f0f2f9] text-[#687089] hover:bg-[#0b1020] hover:text-white transition-colors"
        >
          <LuX size={16} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-tr from-[#5b5bf0] via-[#8b5cf6] to-[#22d3ee] text-white shadow-[0_6px_16px_-4px_rgba(91,91,240,0.6)]">
            <LuStethoscope size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-[#0b1020] tracking-tight">
            DocAppoint
          </h3>
          <p className="mt-1 text-xs text-[#687089]">
            {activeTab === "login"
              ? "Sign in to manage appointments & medical history"
              : "Join thousands of patients booking healthcare easily"}
          </p>
        </div>

        {/* Capsule Tab Switcher */}
        <div className="mb-6 flex gap-1 rounded-full bg-[#f0f2f9] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 rounded-full py-2 text-xs sm:text-[13px] font-semibold transition-all ${
              activeTab === "login"
                ? "bg-white text-[#0b1020] shadow-sm"
                : "text-[#687089] hover:text-[#0b1020]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 rounded-full py-2 text-xs sm:text-[13px] font-semibold transition-all ${
              activeTab === "register"
                ? "bg-white text-[#0b1020] shadow-sm"
                : "text-[#687089] hover:text-[#0b1020]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 pl-10 text-sm text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
                />
                <LuMail className="absolute left-3.5 top-3.5 text-[#99a0b8]" size={16} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 pl-10 text-sm text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
                />
                <LuLock className="absolute left-3.5 top-3.5 text-[#99a0b8]" size={16} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b1020] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:shadow-lg disabled:opacity-50"
            >
              <LuLogIn size={16} />
              <span>{loading ? "Signing in…" : "Sign In"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 pl-10 text-sm text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
                />
                <LuUser className="absolute left-3.5 top-3.5 text-[#99a0b8]" size={16} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 pl-10 text-sm text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
                />
                <LuMail className="absolute left-3.5 top-3.5 text-[#99a0b8]" size={16} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#687089]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[16px] border border-[#e4e7f2] bg-[#f7f8fc] px-4 py-3 pl-10 text-sm text-[#0b1020] outline-none transition-all focus:border-[#5b5bf0] focus:bg-white focus:ring-4 focus:ring-[#5b5bf0]/10"
                />
                <LuLock className="absolute left-3.5 top-3.5 text-[#99a0b8]" size={16} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b1020] py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gradient-to-r hover:from-[#5b5bf0] hover:to-[#8b5cf6] hover:shadow-lg disabled:opacity-50"
            >
              <LuUserPlus size={16} />
              <span>{loading ? "Creating account…" : "Create Account"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
