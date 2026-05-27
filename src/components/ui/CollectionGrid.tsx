import { useState } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, Sparkles } from "lucide-react";
import type { CollectionConfig } from "../../data/collections";

interface CollectionGridProps {
  collections: CollectionConfig[];
  compact?: boolean;
}

function CollectionCard({
  collection,
  index,
  compact,
}: {
  collection: CollectionConfig;
  index: number;
  compact: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group relative flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-cinema-card shadow-lg shadow-black/20 outline-none transition-all duration-300 hover:-translate-y-0.5  hover:shadow-cinema-accent/10 focus-visible:border-cinema-accent focus-visible:ring-2 focus-visible:ring-cinema-accent/30 ${
        compact ? "w-64 md:w-auto" : "w-72 md:w-auto"
      } aspect-[16/9]`}
      aria-label={`Open ${collection.title} collection`}
    >
      {!imageFailed ? (
        <img
          src={collection.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cinema-card via-[#15172a] to-black text-cinema-muted">
          <Clapperboard className="h-9 w-9 opacity-50" />
        </div>
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${collection.accent} opacity-90`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="relative z-10 flex h-full flex-col justify-end p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="w-fit rounded bg-black/45 px-2 py-1 text-[10px] font-body font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            {collection.eyebrow}
          </span>
          {index === 0 && !compact && (
            <span className="hidden rounded bg-cinema-accent/90 px-2 py-1 text-[10px] font-body font-bold uppercase tracking-widest text-white md:inline-flex">
              Start Here
            </span>
          )}
        </div>
        <h3 className="font-display text-[1.7rem] leading-none text-white md:text-3xl">
          {collection.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 max-w-[92%] text-xs leading-relaxed text-white/72 md:text-[13px]">
          {collection.description}
        </p>
      </div>
    </Link>
  );
}

export function CollectionGrid({
  collections,
  compact = false,
}: CollectionGridProps) {
  return (
    <section className="px-4 md:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-body font-bold uppercase tracking-widest text-cinema-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Handpicked
          </div>
          <h2 className="font-display text-2xl tracking-wide text-cinema-text md:text-3xl">
            Collections
          </h2>
          <p className="mt-1 text-sm font-body text-cinema-muted">
            Curated paths for quick, mood-based watching
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            index={index}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
