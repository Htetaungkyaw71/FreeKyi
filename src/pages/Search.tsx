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
  const [results, setResults] = useState<(Movie | TVSeries)[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedQuery = useDebounce(query, 400);
  const searchCacheKey = getSearchCacheKey(debouncedQuery, activeTab, page);

  // Sync from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== query) dispatch(setQuery(q));
  }, [dispatch, query, searchParams]);

  // Reset page on new search or tab
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeTab]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setTotalPages(1);
      return;
    }

    // Update URL
    setSearchParams({ q: debouncedQuery });

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
          res = await searchMulti(debouncedQuery, page);
        } else if (activeTab === "movie") {
          res = await searchMovies(debouncedQuery, page);
        } else {
          res = await searchTV(debouncedQuery, page);
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
  }, [debouncedQuery, activeTab, page, searchCacheKey, setSearchParams]);

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
        noIndex={!trimmedQuery}
        keywords={[
          trimmedQuery,
          `${trimmedQuery} movie`,
          `${trimmedQuery} series`,
          "free movies search",
          "watch movies online",
        ].filter(Boolean)}
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
        className="min-h-screen pt-20 pb-16"
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* <h1 className="font-display text-4xl text-white text-center mb-6">
            Search
          </h1> */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              placeholder="Search movies, TV shows, and more..."
              className="w-full bg-cinema-card border border-cinema-border rounded-2xl pl-12 pr-4 py-4 text-cinema-text placeholder-cinema-muted text-lg focus:outline-none focus:border-cinema-accent transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => dispatch(setQuery(""))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-white"
              >
                <X />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 justify-center">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => dispatch(setActiveTab(id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  activeTab === id
                    ? "bg-cinema-accent text-white shadow-lg shadow-cinema-accent/30"
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
              <GridSkeleton count={12} />
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
                        { ...item, media_type: type } as (Movie | TVSeries) & {
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
                      window.scrollTo({ top: 0, behavior: "smooth" });
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
