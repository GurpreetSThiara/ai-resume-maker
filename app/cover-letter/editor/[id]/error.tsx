'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center"
      role="alert"
      aria-live="polite"
    >
      <h2 className="text-2xl font-semibold mb-2">Error Loading Cover Letter</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
