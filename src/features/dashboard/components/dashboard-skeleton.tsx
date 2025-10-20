export function DashboardSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Message Skeleton */}
        <div className="mb-8 text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>

        {/* No Clients Card Skeleton */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 animate-pulse">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full border border-blue-200"></div>
            <div className="text-center space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}
