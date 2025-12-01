export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-3xl bg-gray-400" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, () => (
          <div
            key={crypto.randomUUID()}
            className="h-36 animate-pulse rounded-xl bg-gray-300"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl bg-gray-300" />
        <div className="h-56 animate-pulse rounded-xl bg-gray-300" />
      </div>
    </div>
  );
}
