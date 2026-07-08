'use client';

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center px-4"
      role="alert"
      aria-live="polite"
    >
      <h2 className="text-2xl font-semibold mb-2">Error Loading Cover Letter</h2>
      <p className="text-red-500 mb-4">
        {error?.message ? `Error: ${error.message}` : "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
