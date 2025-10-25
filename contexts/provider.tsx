"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { ToastProvider } from "@/components/toast/toast-context";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
     <ToastProvider>
  
    <AuthProvider>
      {children}
    </AuthProvider>
      </ToastProvider>
  );
}
