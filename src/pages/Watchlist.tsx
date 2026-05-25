import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListPlus } from "lucide-react";
import { MediaCard } from "../components/cards/MediaCard";
import { Pagination } from "../components/ui/Pagination";
import { useAppSelector } from "../hooks/useStore";
import { SEO } from "../components/seo/SEO";

export default function Watchlist() {
  const watchlist = useAppSelector((s) => s.watchlist.items);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE);

  // If items get removed causing the total pages to shrink below the current page
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  const paginatedWatchlist = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return watchlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [watchlist, page]);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="My Watchlist"
        description="Your FreeKyi watchlist with saved movies and TV series."
        path="/watchlist"
        noIndex
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 pb-16"
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-white">
            My Watchlist
          </h1>
          <p className="text-cinema-muted text-sm font-body mt-1">
            {watchlist.length} saved{" "}
            {watchlist.length === 1 ? "title" : "titles"}
          </p>
        </div>

        <AnimatePresence>
          {watchlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-cinema-muted"
            >
              <ListPlus className="w-20 h-20 mb-4 opacity-20" />
              <p className="text-xl font-display">No watchlist items yet</p>
              <p className="text-sm mt-2 font-body">
                Start curating your watchlist!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {paginatedWatchlist.map((item, idx) => (
                  <MediaCard
                    key={`${item.id}-${item.media_type}`}
                    item={item}
                    type={item.media_type}
                    index={idx}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
