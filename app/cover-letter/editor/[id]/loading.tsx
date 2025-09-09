export default function Loading() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-var(--header-height))]">
        <div className="p-6 space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
          <div className="h-40 w-full bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="hidden lg:block bg-gray-100 p-6">
          <div className="h-full w-full bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }
  