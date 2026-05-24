import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Genre, FilterState } from "../../types";

interface FilterBarProps {
  genres: Genre[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Box Office" },
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "KR", name: "South Korea" },
  { code: "JP", name: "Japan" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "DE", name: "Germany" },
  { code: "CN", name: "China" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
// const RATINGS = [9, 8, 7, 6, 5];

export function FilterBar({
  genres,
  filters,
  onFilterChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.genre !== null ||
    filters.year !== null ||
    filters.rating !== null ||
    filters.country !== null;

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-xl p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cinema-text font-body font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-cinema-accent" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-cinema-accent rounded-full" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-cinema-muted hover:text-cinema-accent transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full bg-cinema-hover border border-cinema-border rounded-lg px-3 py-2 text-sm text-cinema-text focus:outline-none focus:border-cinema-accent transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Country
        </label>
        <select
          value={filters.country ?? ""}
          onChange={(e) =>
            onFilterChange({
              country: e.target.value ? e.target.value : null,
            })
          }
          className="w-full bg-cinema-hover border border-cinema-border rounded-lg px-3 py-2 text-sm text-cinema-text focus:outline-none focus:border-cinema-accent transition-colors"
        >
          <option value="">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Genre
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() =>
                onFilterChange({ genre: filters.genre === g.id ? null : g.id })
              }
              className={`text-xs px-3 py-1.5 rounded-full font-body transition-all duration-200 ${
                filters.genre === g.id
                  ? "bg-cinema-accent text-white"
                  : "bg-cinema-hover text-cinema-muted hover:text-white hover:bg-cinema-border"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Year
        </label>
        <select
          value={filters.year ?? ""}
          onChange={(e) =>
            onFilterChange({
              year: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="w-full bg-cinema-hover border border-cinema-border rounded-lg px-3 py-2 text-sm text-cinema-text focus:outline-none focus:border-cinema-accent transition-colors"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}

      {/* Min Rating */}
      {/* <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">Min Rating</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({ rating: null })}
            className={`text-xs px-3 py-1.5 rounded-full font-body transition-all duration-200 ${
              filters.rating === null
                ? 'bg-cinema-accent text-white'
                : 'bg-cinema-hover text-cinema-muted hover:text-white'
            }`}
          >
            Any
          </button>
          {RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => onFilterChange({ rating: filters.rating === r ? null : r })}
              className={`text-xs px-3 py-1.5 rounded-full font-body transition-all duration-200 ${
                filters.rating === r
                  ? 'bg-cinema-accent text-white'
                  : 'bg-cinema-hover text-cinema-muted hover:text-white'
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}
