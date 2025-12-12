export function ClientsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }, () => (
        <div
          key={crypto.randomUUID()}
          className="h-24 animate-pulse rounded-xl bg-gray-200"
        />
      ))}
    </div>
  );
}
