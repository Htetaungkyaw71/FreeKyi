export function CardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-cinema-card flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
      <div className="skeleton aspect-[2/3] w-full" />
      <div className="p-2 space-y-2">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-6 w-40 rounded" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px]">
      <div className="skeleton absolute inset-0" />
      <div className="absolute bottom-16 left-8 md:left-16 space-y-4">
        <div className="skeleton h-10 w-72 rounded" />
        <div className="skeleton h-4 w-96 rounded" />
        <div className="skeleton h-4 w-80 rounded" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-12 w-32 rounded-full" />
          <div className="skeleton h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="skeleton w-full h-[50vh]" />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="skeleton h-8 w-64 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-4/6 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden bg-cinema-card">
          <div className="skeleton aspect-[2/3] w-full" />
          <div className="p-2 space-y-2">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
