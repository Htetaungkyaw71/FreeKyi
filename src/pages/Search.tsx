import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Film, Tv, Layers, X } from "lucide-react";
import { MediaCard } from "../components/cards/MediaCard";
import { GridSkeleton } from "../components/skeletons";
import { Pagination } from "../components/ui/Pagination";
import { searchMulti, searchMovies, searchTV } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import { setQuery, setActiveTab } from "../store/slices/searchSlice";
import type { Movie, TVSeries } from "../types";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";

type SearchTab = "all" | "movie" | "tv";
type SearchResult = Partial<Movie & TVSeries> & {
  id: number;
  media_type?: "movie" | "tv" | "person";
};

interface SearchPageData {
  results: (Movie | TVSeries)[];
  totalResults: number;
  totalPages: number;
}

const SEARCH_CACHE_TTL = 1000 * 60 * 10;
const searchCache = new Map<
  string,
  { data: SearchPageData; updatedAt: number }
>();

function getSearchCacheKey(query: string, tab: SearchTab, page: number) {
  return `${tab}:${page}:${query.trim().toLowerCase()}`;
}

function getFreshSearchCache(key: string) {
  const cached = searchCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= SEARCH_CACHE_TTL) return null;
  return cached.data;
}

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { query, activeTab } = useAppSelector((s) => s.search);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [results, setResults] = useState<(Movie | TVSeries)[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [urlReady, setUrlReady] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const searchCacheKey = getSearchCacheKey(debouncedQuery, activeTab, page);

  // Sync from URL only when the URL query changes.
  useEffect(() => {
    dispatch(setQuery(urlQuery));
    setUrlReady(true);
  }, [dispatch, urlQuery]);

  // Reset page on new search or tab
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeTab]);

  useEffect(() => {
    if (!urlReady) return;

    const trimmedLiveQuery = query.trim();
    const trimmedDebouncedQuery = debouncedQuery.trim();

    if (trimmedLiveQuery !== trimmedDebouncedQuery) return;

    if (!trimmedDebouncedQuery) {
      if (urlQuery) {
        setSearchParams({}, { replace: true });
      }
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
      return;
    }

    // Update URL
    if (urlQuery !== trimmedDebouncedQuery) {
      setSearchParams({ q: trimmedDebouncedQuery }, { replace: true });
    }

    const cachedData = getFreshSearchCache(searchCacheKey);
    if (cachedData) {
      setResults(cachedData.results);
      setTotalResults(cachedData.totalResults);
      setTotalPages(cachedData.totalPages);
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetch = async () => {
      if (!searchCache.get(searchCacheKey)) {
        setResults([]);
        setTotalResults(0);
        setTotalPages(1);
      }
      setLoading(true);
      try {
        let res;
        if (activeTab === "all") {
          res = await searchMulti(trimmedDebouncedQuery, page);
        } else if (activeTab === "movie") {
          res = await searchMovies(trimmedDebouncedQuery, page);
        } else {
          res = await searchTV(trimmedDebouncedQuery, page);
        }

        if (!isActive) return;

        const mappedResults = (res.data.results as SearchResult[]).map((r) => {
          const mediaType =
            r.media_type || (activeTab === "tv" ? "tv" : "movie");
          return { ...r, media_type: mediaType };
        });

        const filtered = mappedResults.filter(
          (r) =>
            r.media_type !== "person" && (r.poster_path || r.backdrop_path),
        ) as (Movie | TVSeries)[];

        searchCache.set(searchCacheKey, {
          data: {
            results: filtered,
            totalResults: res.data.total_results,
            totalPages: res.data.total_pages,
          },
          updatedAt: Date.now(),
        });

        setResults(filtered);
        setTotalResults(res.data.total_results);
        setTotalPages(res.data.total_pages);
      } catch (e) {
        if (isActive) console.error(e);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetch();

    return () => {
      isActive = false;
    };
  }, [
    debouncedQuery,
    query,
    activeTab,
    page,
    searchCacheKey,
    urlQuery,
    urlReady,
    setSearchParams,
  ]);

  const handleQueryChange = (value: string) => {
    dispatch(setQuery(value));
    if (!value.trim() && urlQuery) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleClearSearch = () => {
    dispatch(setQuery(""));
    setSearchParams({}, { replace: true });
    setResults([]);
    setTotalResults(0);
    setTotalPages(1);
    setPage(1);
  };

  const tabs = [
    { id: "all", label: "All", icon: Layers },
    { id: "movie", label: "Movies", icon: Film },
    { id: "tv", label: "TV Series", icon: Tv },
  ] as const;
  const trimmedQuery = debouncedQuery.trim();
  const searchPath = trimmedQuery
    ? `/search?q=${encodeURIComponent(trimmedQuery)}`
    : "/search";
  const searchTitle = trimmedQuery
    ? `Search ${trimmedQuery} Free Movies & TV Series`
    : "Search Free Movies & TV Series";
  const searchDescription = trimmedQuery
    ? `Search results for ${trimmedQuery} on FreeKyi. Find matching movies and TV series, watch trailers, compare ratings, and start streaming online.`
    : "Search FreeKyi for free movies, TV series, Korean dramas, new releases, and trending titles to watch online.";

  return (
    <>
      <SEO
        title={searchTitle}
        description={searchDescription}
        path={searchPath}
        keywords={[
          trimmedQuery,
          `${trimmedQuery} movie`,
          `${trimmedQuery} series`,
          "free movies search",
          "watch movies online",
        ].filter(Boolean)}
        noIndex
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: searchTitle,
          url: `${seoConfig.siteUrl}${searchPath}`,
          description: searchDescription,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: results.slice(0, 12).map((item, index) => {
              const type =
                (item as { media_type?: string }).media_type === "tv"
                  ? "tv"
                  : "movie";
              const title = (item as Movie).title || (item as TVSeries).name;

              return {
                "@type": "ListItem",
                position: index + 1,
                url: `${seoConfig.siteUrl}/${type}/${item.id}`,
                name: title,
              };
            }),
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] pt-[4.75rem] md:pb-16 md:pt-20"
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          {/* Search Bar */}
          <div className="mx-auto mb-6 max-w-2xl md:mb-8">
            {/* <h1 className="font-display text-4xl text-white text-center mb-6">
            Search
          </h1> */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-cinema-muted md:left-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search movies, TV shows, and more..."
                className="w-full rounded-xl border border-cinema-border bg-cinema-card py-3 pl-11 pr-11 text-base text-cinema-text placeholder-cinema-muted transition-colors focus:border-cinema-accent focus:outline-none md:rounded-2xl md:py-4 md:pl-12 md:pr-12 md:text-lg"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cinema-muted transition-colors hover:text-white md:right-4"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-4 flex justify-start gap-2 overflow-x-auto scrollbar-hide px-0.5 sm:justify-center">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => dispatch(setActiveTab(id))}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-body font-medium transition-all md:px-4 ${
                    activeTab === id
                      ? "bg-cinema-accent text-white shadow-lg shadow-cinema-accent/20"
                      : "bg-cinema-card border border-cinema-border text-cinema-muted hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GridSkeleton
                  count={12}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                />
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                key={debouncedQuery + activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-cinema-muted text-sm mb-4 font-body">
                  {totalResults.toLocaleString()} results for{" "}
                  <span className="text-white">"{debouncedQuery}"</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {results.map((item, idx) => {
                    const type =
                      (item as { media_type?: string }).media_type === "tv"
                        ? "tv"
                        : "movie";
                    return (
                      <MediaCard
                        key={`${item.id}-${type}`}
                        item={
                          { ...item, media_type: type } as (
                            | Movie
                            | TVSeries
                          ) & {
                            media_type: "movie" | "tv";
                          }
                        }
                        type={type}
                        index={idx}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: "auto" });
                      }}
                    />
                  </div>
                )}
              </motion.div>
            ) : debouncedQuery ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-cinema-muted"
              >
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-xl font-display">No results found</p>
                <p className="text-sm mt-2 font-body">Try different keywords</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-cinema-muted"
              >
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-body">Start typing to search</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
