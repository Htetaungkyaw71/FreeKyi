import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MediaCard } from "../components/cards/MediaCard";
import { FilterBar } from "../components/ui/FilterBar";
import { Pagination } from "../components/ui/Pagination";
import { GridSkeleton } from "../components/skeletons";
import {
  discoverMovies,
  discoverTV,
  getMovieGenres,
  getTVGenres,
} from "../services/tmdb";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import {
  setMovieFilter,
  setTVFilter,
  resetMovieFilters,
  resetTVFilters,
} from "../store/slices/filtersSlice";
import type { Movie, TVSeries, Genre } from "../types";
import { SlidersHorizontal, X } from "lucide-react";

interface BrowseProps {
  mediaType: "movie" | "tv";
}

export default function Browse({ mediaType }: BrowseProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) =>
    mediaType === "movie" ? s.filters.movie : s.filters.tv,
  );
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState<(Movie | TVSeries)[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // Initialize from URL params and reset on unmount
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    if (genreParam) {
      if (mediaType === "movie")
        dispatch(setMovieFilter({ genre: Number(genreParam) }));
      else dispatch(setTVFilter({ genre: Number(genreParam) }));
    }

    // Reset filters when unmounting or changing media type
    return () => {
      dispatch(resetMovieFilters());
      dispatch(resetTVFilters());
    };
  }, [dispatch, mediaType]); // removed searchParams to avoid resetting during URL changes

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res =
          mediaType === "movie" ? await getMovieGenres() : await getTVGenres();
        setGenres(res.data.genres);
      } catch (e) {
        console.error(e);
      }
    };
    fetchGenres();
  }, [mediaType]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page,
          sort_by: filters.sortBy,
        };
        if (filters.genre) params.with_genres = String(filters.genre);
        if (filters.rating) params["vote_average.gte"] = filters.rating;

        let data;
        if (mediaType === "movie") {
          if (filters.year) params.primary_release_year = filters.year;
          const res = await discoverMovies(
            params as Parameters<typeof discoverMovies>[0],
          );
          data = res.data;
        } else {
          if (filters.year) params.first_air_date_year = filters.year;
          const res = await discoverTV(
            params as Parameters<typeof discoverTV>[0],
          );
          data = res.data;
        }
        setItems(data.results);
        setTotalPages(data.total_pages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [mediaType, filters, page]);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (f: Parameters<typeof setMovieFilter>[0]) => {
    if (mediaType === "movie") dispatch(setMovieFilter(f));
    else dispatch(setTVFilter(f));
    setPage(1);
  };

  const handleReset = () => {
    if (mediaType === "movie") dispatch(resetMovieFilters());
    else dispatch(resetTVFilters());
    setPage(1);
  };

  const title = mediaType === "movie" ? "Movies" : "TV Series";
  const genreLabel = genres.find((g) => g.id === filters.genre)?.name;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-16"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-white">
              {genreLabel ? genreLabel : title}
            </h1>
            <p className="text-cinema-muted text-sm font-body mt-1">
              {totalPages * 20} {title} Available
            </p>
          </div>
          <button
            onClick={() => setShowFilterMobile(!showFilterMobile)}
            className="md:hidden flex items-center gap-2 bg-cinema-card border border-cinema-border px-4 py-2 rounded-lg text-sm text-cinema-text"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Mobile Overlay */}
          {showFilterMobile && (
            <div
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
              onClick={() => setShowFilterMobile(false)}
            />
          )}

          {/* Sidebar */}

          <aside
            className={`
            fixed md:static inset-x-0 z-50 
            bg-cinema-bg md:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showFilterMobile ? "translate-y-0" : "translate-y-[110%]"} 
            md:translate-y-0
            md:block w-full md:w-64 md:flex-shrink-0
            rounded-t-2xl md:rounded-none
            border-t border-cinema-border md:border-0
            overflow-y-auto md:max-h-none md:overflow-visible
            p-6 md:p-0
          `}
            style={{
              bottom: 0,
              maxHeight: "85svh",
            }}
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-2xl font-display text-white">Filters</h2>
              <button
                onClick={() => setShowFilterMobile(false)}
                className="p-1 text-cinema-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="md:sticky md:top-20">
              <FilterBar
                genres={genres}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Grid */}

          <div className="flex-1 min-w-0">
            {loading ? (
              <GridSkeleton count={20} />
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-cinema-muted">
                <p className="text-xl font-display">No results found</p>
                <p className="text-sm mt-2 font-body">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {items.map((item, idx) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      type={mediaType}
                      index={idx}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
