import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Genre, FilterState } from "../../types";
import { COUNTRIES, SORT_OPTIONS, YEARS } from "./filterOptions";
import { CustomSelect } from "./CustomSelect";

interface FilterBarProps {
  genres: Genre[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

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
    filters.country !== null ||
    filters.sortBy !== "popularity.desc";
  const sortOptions = SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
  }));
  const countryOptions = [
    { label: "All Countries", value: "" },
    ...COUNTRIES.map((country) => ({
      label: country.name,
      value: country.code,
    })),
  ];
  const yearOptions = [
    { label: "All Years", value: "" },
    ...YEARS.map((year) => ({
      label: String(year),
      value: String(year),
    })),
  ];

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
        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="flex items-center gap-1 text-xs text-cinema-muted transition-colors hover:text-cinema-accent disabled:cursor-default disabled:opacity-40 disabled:hover:text-cinema-muted"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Sort By
        </label>
        <CustomSelect
          ariaLabel="Sort by"
          value={filters.sortBy}
          options={sortOptions}
          onChange={(value) => onFilterChange({ sortBy: value })}
          buttonClassName="rounded-lg bg-cinema-hover"
        />
      </div>

      <div>
        <label className="block text-xs text-cinema-muted font-body uppercase tracking-wider mb-2">
          Country
        </label>
        <CustomSelect
          ariaLabel="Country"
          value={filters.country ?? ""}
          options={countryOptions}
          onChange={(value) =>
            onFilterChange({
              country: value ? value : null,
            })
          }
          buttonClassName="rounded-lg bg-cinema-hover"
        />
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
        <CustomSelect
          ariaLabel="Year"
          value={filters.year ? String(filters.year) : ""}
          options={yearOptions}
          onChange={(value) =>
            onFilterChange({
              year: value ? Number(value) : null,
            })
          }
          buttonClassName="rounded-lg bg-cinema-hover"
        />
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
