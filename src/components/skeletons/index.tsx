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
        <div className="skeleton h-4 w-80 rounded" />
        <div className="skeleton h-4 w-80 rounded" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-12 w-32 rounded-full" />
          <div className="skeleton h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * DetailSkeleton
 * Mirrors the exact structure of the Detail page so the loading state
 * feels like a "ghost" of the real content rather than a generic spinner.
 *
 * Layout map (matches Detail.tsx):
 *   1. Theater Zone – bg-black strip
 *      a. Season dropdown ghost  (TV only — always shown here for worst-case size)
 *      b. 16:9 player ghost
 *      c. Episode pill row ghost (TV only)
 *   2. Metadata Zone – max-w-screen-2xl padded section
 *      a. Poster ghost  (hidden on mobile, matches sm:block)
 *      b. Info column
 *         – genre chip ghosts
 *         – title ghost (large)
 *         – tagline ghost
 *         – meta row ghosts (rating / year / runtime / status)
 *         – overview lines ghost
 *         – bookmark button ghost
 *   3. Cast row – 10 avatar circles
 */

interface DetailSkeletonProps {
  /** Pass mediaType so TV-specific regions (season bar, episode row) render */
  mediaType?: "movie" | "tv";
}

const Shimmer = ({
  className,
  style,
}: {
  className: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse bg-cinema-hover rounded ${className}`}
    style={style}
  />
);

export function DetailSkeleton({ mediaType = "tv" }: DetailSkeletonProps) {
  const isTV = mediaType === "tv";

  return (
    <div className="min-h-screen">
      {/* ── 1. THEATER ZONE ──────────────────────────────────────────────────── */}
      <div className="relative w-full bg-black">
        {/* 1a. Season dropdown ghost */}

        {/* 1b. 16:9 player ghost */}
        <div className="max-w-screen-2xl mx-auto  pb-4">
          <div className="w-full aspect-video rounded-xl bg-cinema-hover animate-pulse" />
        </div>

        {/* 1c. Episode pill row ghost (TV) */}
        {isTV && (
          <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pb-5">
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => (
                <Shimmer
                  key={i}
                  className="h-9 w-14 flex-shrink-0 rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. METADATA ZONE ─────────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 2a. Poster ghost — only visible sm+ (matches hidden sm:block) */}
          <div className="hidden sm:block flex-shrink-0 w-36 md:w-44 lg:w-52 self-start">
            {/* poster is roughly 3:4 ratio */}
            <div className="w-full aspect-[2/3] rounded-xl bg-cinema-hover animate-pulse" />
          </div>

          {/* 2b. Info column */}
          <div className="flex-1 space-y-4">
            {/* Genre chips */}
            <div className="flex flex-wrap gap-2">
              {[60, 72, 54, 80].map((w, i) => (
                <Shimmer
                  key={i}
                  className={`h-6 rounded-full`}
                  style={{ width: w }}
                />
              ))}
            </div>

            {/* Title */}
            <Shimmer className="h-10 md:h-14 w-3/4 rounded-lg" />

            {/* Tagline */}
            <Shimmer className="h-4 w-1/2 rounded" />

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 py-1">
              <Shimmer className="h-5 w-16 rounded" />
              <Shimmer className="h-5 w-12 rounded" />
              <Shimmer className="h-5 w-14 rounded" />
              <Shimmer className="h-5 w-20 rounded" />
              <Shimmer className="h-5 w-16 rounded" />
              <Shimmer className="h-5 w-20 rounded-full" />
            </div>

            {/* Overview — 4 lines of varying width */}
            <div className="space-y-2 max-w-2xl">
              <Shimmer className="h-4 w-full rounded" />
              <Shimmer className="h-4 w-full rounded" />
              <Shimmer className="h-4 w-5/6 rounded" />
              <Shimmer className="h-4 w-4/6 rounded" />
            </div>

            {/* Bookmark button ghost */}
            <Shimmer className="h-11 w-40 rounded-full mt-2" />
          </div>
        </div>

        {/* ── 3. CAST ROW ────────────────────────────────────────────────────── */}
        <div className="mt-12">
          {/* Section heading ghost */}
          <Shimmer className="h-7 w-20 rounded mb-5" />

          <div className="flex gap-4 overflow-hidden pb-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-24 flex flex-col items-center gap-2"
              >
                {/* Avatar circle */}
                <div className="w-24 h-24 rounded-full bg-cinema-hover animate-pulse" />
                {/* Name */}
                <Shimmer className="h-3 w-16 rounded" />
                {/* Character */}
                <Shimmer className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export function DetailSkeleton() {
//   return (
//     <div className="min-h-screen">
//       <div className="skeleton w-full h-[50vh]" />
//       <div className="container mx-auto px-4 py-8 space-y-6">
//         <div className="skeleton h-8 w-64 rounded" />
//         <div className="skeleton h-4 w-full rounded" />
//         <div className="skeleton h-4 w-5/6 rounded" />
//         <div className="skeleton h-4 w-4/6 rounded" />
//       </div>
//     </div>
//   );
// }

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
