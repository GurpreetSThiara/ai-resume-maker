"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { ToastProvider } from "@/components/toast/toast-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthModalProvider } from "./auth-modal-context";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
     <ToastProvider>
      <TooltipProvider> 
  
    <AuthProvider>
      <AuthModalProvider>
        {children}
      </AuthModalProvider>
    </AuthProvider>
    </TooltipProvider>
      </ToastProvider>
  );
}
