import { useState, useEffect, useMemo } from "react";
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
  getNowPlayingMovies,
  getUpcomingMovies,
  getAiringTodayTV,
} from "../services/tmdb";
import type { Movie, TVSeries, Genre, FilterState } from "../types";
import { SlidersHorizontal, X } from "lucide-react";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";

interface BrowseProps {
  mediaType: "movie" | "tv";
}

interface BrowsePageData {
  items: (Movie | TVSeries)[];
  totalPages: number;
}

const BROWSE_CACHE_TTL = 1000 * 60 * 10;
const browseCache = new Map<
  string,
  { data: BrowsePageData; updatedAt: number }
>();
const genreCache = new Map<
  "movie" | "tv",
  { data: Genre[]; updatedAt: number }
>();

function getFreshBrowseCache(key: string) {
  const cached = browseCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= BROWSE_CACHE_TTL) return null;
  return cached.data;
}

function getFreshGenreCache(mediaType: "movie" | "tv") {
  const cached = genreCache.get(mediaType);
  if (!cached || Date.now() - cached.updatedAt >= BROWSE_CACHE_TTL) return null;
  return cached.data;
}

export default function Browse({ mediaType }: BrowseProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const browseCacheKey = `${mediaType}:${searchParams.toString()}`;
  const initialBrowseData = getFreshBrowseCache(browseCacheKey);
  const initialGenres = getFreshGenreCache(mediaType);

  const filters: FilterState = useMemo(
    () => ({
      genre: searchParams.get("genre")
        ? Number(searchParams.get("genre"))
        : null,
      rating: searchParams.get("rating")
        ? Number(searchParams.get("rating"))
        : null,
      year: searchParams.get("year") ? Number(searchParams.get("year")) : null,
      country: searchParams.get("country") || null,
      sortBy: searchParams.get("sortBy") || "popularity.desc",
    }),
    [searchParams],
  );

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [items, setItems] = useState<(Movie | TVSeries)[]>(
    () => initialBrowseData?.items ?? [],
  );
  const [genres, setGenres] = useState<Genre[]>(() => initialGenres ?? []);
  const [loading, setLoading] = useState(() => !initialBrowseData);
  const [totalPages, setTotalPages] = useState(
    () => initialBrowseData?.totalPages ?? 1,
  );
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  useEffect(() => {
    const cachedGenres = getFreshGenreCache(mediaType);
    if (cachedGenres) {
      setGenres(cachedGenres);
      return;
    }

    let isActive = true;
    const fetchGenres = async () => {
      try {
        const res =
          mediaType === "movie" ? await getMovieGenres() : await getTVGenres();
        genreCache.set(mediaType, {
          data: res.data.genres,
          updatedAt: Date.now(),
        });
        if (!isActive) return;
        setGenres(res.data.genres);
      } catch (e) {
        console.error(e);
      }
    };
    fetchGenres();

    return () => {
      isActive = false;
    };
  }, [mediaType]);

  useEffect(() => {
    const cachedData = getFreshBrowseCache(browseCacheKey);
    if (cachedData) {
      setItems(cachedData.items);
      setTotalPages(cachedData.totalPages);
      setLoading(false);
      return;
    }

    let isActive = true;
    const fetchItems = async () => {
      if (!browseCache.get(browseCacheKey)) {
        setItems([]);
        setTotalPages(1);
        setLoading(true);
      }

      try {
        const sortParam = searchParams.get("sort");
        const hasCustomFilters =
          filters.genre ||
          filters.rating ||
          filters.year ||
          filters.country ||
          filters.sortBy !== "popularity.desc";

        let data;
        if (mediaType === "movie") {
          if (sortParam === "now_playing" && !hasCustomFilters) {
            const res = await getNowPlayingMovies(page);
            data = res.data;
          } else if (sortParam === "upcoming" && !hasCustomFilters) {
            const res = await getUpcomingMovies(page);
            data = res.data;
          } else {
            const params: Record<string, unknown> = {
              page,
              sort_by: filters.sortBy,
            };
            if (filters.genre) params.with_genres = String(filters.genre);
            if (filters.rating) params["vote_average.gte"] = filters.rating;
            if (filters.year) params.primary_release_year = filters.year;
            if (filters.country) params.with_origin_country = filters.country;

            const res = await discoverMovies(
              params as Parameters<typeof discoverMovies>[0],
            );
            data = res.data;
          }
        } else {
          if (sortParam === "airing_today" && !hasCustomFilters) {
            const res = await getAiringTodayTV(page);
            data = res.data;
          } else {
            const params: Record<string, unknown> = {
              page,
              sort_by: filters.sortBy,
            };
            if (filters.genre) params.with_genres = String(filters.genre);
            if (filters.rating) params["vote_average.gte"] = filters.rating;
            if (filters.year) params.first_air_date_year = filters.year;
            if (filters.country) params.with_origin_country = filters.country;

            const res = await discoverTV(
              params as Parameters<typeof discoverTV>[0],
            );
            data = res.data;
          }
        }
        browseCache.set(browseCacheKey, {
          data: { items: data.results, totalPages: data.total_pages },
          updatedAt: Date.now(),
        });

        if (!isActive) return;
        setItems(data.results);
        setTotalPages(data.total_pages);
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchItems();

    return () => {
      isActive = false;
    };
  }, [mediaType, filters, page, searchParams, browseCacheKey]);

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (p === 1) newParams.delete("page");
    else newParams.set("page", String(p));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleFilterChange = (f: Partial<FilterState>) => {
    const newParams = new URLSearchParams(searchParams);
    if (f.genre !== undefined) {
      if (f.genre === null) newParams.delete("genre");
      else newParams.set("genre", String(f.genre));
    }
    if (f.rating !== undefined) {
      if (f.rating === null) newParams.delete("rating");
      else newParams.set("rating", String(f.rating));
    }
    if (f.year !== undefined) {
      if (f.year === null) newParams.delete("year");
      else newParams.set("year", String(f.year));
    }
    if (f.country !== undefined) {
      if (f.country === null) newParams.delete("country");
      else newParams.set("country", f.country);
    }
    if (f.sortBy !== undefined) {
      if (f.sortBy === "popularity.desc" || f.sortBy === null)
        newParams.delete("sortBy");
      else newParams.set("sortBy", f.sortBy);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("genre");
    newParams.delete("rating");
    newParams.delete("year");
    newParams.delete("country");
    newParams.delete("sortBy");
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const baseTitle = mediaType === "movie" ? "Movies" : "TV Series";
  const sortParam = searchParams.get("sort");

  let title = baseTitle;
  if (sortParam === "now_playing" && !filters.genre)
    title = `Now Playing ${baseTitle}`;
  else if (sortParam === "upcoming" && !filters.genre)
    title = `Upcoming ${baseTitle}`;
  else if (sortParam === "airing_today" && !filters.genre)
    title = `Airing Today ${baseTitle}`;
  else if (filters.country === "KR") title = `Korean Dramas`;

  const genreLabel = genres.find((g) => g.id === filters.genre)?.name;
  const pageTitle = genreLabel ? `${genreLabel} ${baseTitle}` : title;
  const browsePathBase = mediaType === "movie" ? "/movies" : "/tv";
  const browseSearch = searchParams.toString();
  const browsePath = browseSearch
    ? `${browsePathBase}?${browseSearch}`
    : browsePathBase;
  const mediaLabel = mediaType === "movie" ? "movies" : "TV series";
  const browseDescription = `Browse ${pageTitle.toLowerCase()} on FreeKyi. Find popular ${mediaLabel}, filter by genre, rating, year, country, and stream titles online.`;

  return (
    <>
      <SEO
        title={`${pageTitle} Online`}
        description={browseDescription}
        path={browsePath}
        keywords={[
          `${pageTitle.toLowerCase()} online`,
          `free ${mediaLabel}`,
          `watch ${mediaLabel} online`,
          "free streaming",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${pageTitle} Online`,
          url: `${seoConfig.siteUrl}${browsePath}`,
          description: browseDescription,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.slice(0, 12).map((item, index) => {
              const itemType =
                (item as { media_type?: string }).media_type || mediaType;
              const itemTitle =
                (item as Movie).title || (item as TVSeries).name;

              return {
                "@type": "ListItem",
                position: index + 1,
                url: `${seoConfig.siteUrl}/${itemType}/${item.id}`,
                name: itemTitle,
              };
            }),
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 pb-0"
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
                className="fixed inset-0 bg-black/80 z-[90] md:hidden"
                onClick={() => setShowFilterMobile(false)}
              />
            )}

            {/* Sidebar */}

            <aside
              className={`
            fixed md:sticky md:top-24 md:self-start inset-x-0 z-[100]
            bg-cinema-bg md:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showFilterMobile ? "translate-y-0" : "translate-y-[110%]"} 
            md:translate-y-0
            md:block w-full md:w-64 md:flex-shrink-0
            rounded-t-2xl md:rounded-none
            border-t border-cinema-border md:border-0
            overflow-y-auto
            p-6 md:p-0
            bottom-0 max-h-[85svh] md:bottom-auto md:max-h-[calc(100vh-8rem)]
            scrollbar-hide
          `}
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

              <div className="w-full">
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
    </>
  );
}
