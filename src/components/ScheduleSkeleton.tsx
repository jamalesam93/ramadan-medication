'use client';

export function ScheduleSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg p-4 border-l-4 border-gray-200 bg-gray-50 shadow-sm"
        >
          <div className="flex items-start gap-4">
            {/* Pill icon placeholder */}
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            {/* Content placeholder */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="flex gap-2 mt-3">
                <div className="h-9 bg-gray-200 rounded w-24" />
                <div className="h-9 bg-gray-100 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
