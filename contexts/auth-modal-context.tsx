"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

interface AuthModalContextValue {
  open: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value: AuthModalContextValue = {
    open: () => setOpen(true),
    close: () => setOpen(false),
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal open={open} onOpenChange={setOpen} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return ctx;
}
