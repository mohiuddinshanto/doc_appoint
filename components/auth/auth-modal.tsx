"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import { LuMail, LuLock, LuUser, LuLogIn, LuUserPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { authClient, getBackendToken } from "@/lib/auth-client";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Better Auth Login
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to sign in. Check credentials.");
      } else {
        const token = await getBackendToken();

        const userId = res.data?.user?.id;
        if (!userId) {
          throw new Error("Sign-in succeeded but the server did not return a user ID.");
        }

        const loggedInUser = {
          id: userId,
          name: res.data?.user?.name || email.split("@")[0],
          email: res.data?.user?.email || email,
        };

        setAuth(loggedInUser, token);
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
        const token = await getBackendToken();

        const userId = res.data?.user?.id;
        if (!userId) {
          throw new Error("Registration succeeded but the server did not return a user ID.");
        }

        const newUser = {
          id: userId,
          name: name,
          email: email,
        };

        setAuth(newUser, token);
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      size="md"
      classNames={{
        base: "border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl",
        header: "border-b border-gray-100 pb-3",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-gray-900">
                {activeTab === "login" ? "Sign In to ServiceSlot" : "Create Account"}
              </h3>
              <p className="text-xs text-gray-500 font-normal">
                {activeTab === "login"
                  ? "Access your appointments and manage your doctor bookings"
                  : "Join thousands of patients booking healthcare services easily"}
              </p>
            </ModalHeader>

            <ModalBody className="py-4">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as "login" | "register")}
                variant="solid"
                color="primary"
                fullWidth
                className="mb-4"
              >
                <Tab
                  key="login"
                  title={
                    <div className="flex items-center gap-2">
                      <LuLogIn size={15} />
                      <span>Sign In</span>
                    </div>
                  }
                />
                <Tab
                  key="register"
                  title={
                    <div className="flex items-center gap-2">
                      <LuUserPlus size={15} />
                      <span>Register</span>
                    </div>
                  }
                />
              </Tabs>

              {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                    variant="bordered"
                    startContent={<LuMail className="text-gray-400" size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    type="password"
                    variant="bordered"
                    startContent={<LuLock className="text-gray-400" size={18} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="w-full font-semibold shadow-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white"
                    isLoading={loading}
                  >
                    Sign In
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    type="text"
                    variant="bordered"
                    startContent={<LuUser className="text-gray-400" size={18} />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                    variant="bordered"
                    startContent={<LuMail className="text-gray-400" size={18} />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    placeholder="At least 6 characters"
                    type="password"
                    variant="bordered"
                    startContent={<LuLock className="text-gray-400" size={18} />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    color="primary"
                    className="w-full font-semibold shadow-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white"
                    isLoading={loading}
                  >
                    Create Account
                  </Button>
                </form>
              )}
            </ModalBody>

            <ModalFooter className="border-t border-gray-100 pt-3">
              <p className="w-full text-center text-xs text-gray-400">
                Protected by Better Auth â€¢ End-to-End JWT Verified
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

