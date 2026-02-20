"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

interface AuthModalContextValue {
  open: (redirectTo?: string) => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [openState, setOpenState] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | undefined>();

  const value: AuthModalContextValue = {
    open: (url?: string) => {
      setRedirectTo(url)
      setOpenState(true)
    },
    close: () => {
      setOpenState(false)
      setRedirectTo(undefined)
    },
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal open={openState} onOpenChange={setOpenState} redirectTo={redirectTo} />
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
