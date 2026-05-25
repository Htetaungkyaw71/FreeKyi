import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import { MediaCard } from "../components/cards/MediaCard";
import { Pagination } from "../components/ui/Pagination";
import { useAppSelector } from "../hooks/useStore";
import { SEO } from "../components/seo/SEO";

export default function Bookmarks() {
  const bookmarks = useAppSelector((s) => s.bookmarks.items);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(bookmarks.length / ITEMS_PER_PAGE);

  // If items get removed causing the total pages to shrink below the current page
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  const paginatedBookmarks = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return bookmarks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [bookmarks, page]);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <SEO
        title="My Bookmarks"
        description="Your saved movies and TV series on FreeKyi."
        path="/bookmarks"
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
              My Bookmarks
            </h1>
            <p className="text-cinema-muted text-sm font-body mt-1">
              {bookmarks.length} saved{" "}
              {bookmarks.length === 1 ? "title" : "titles"}
            </p>
          </div>

          <AnimatePresence>
            {bookmarks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-cinema-muted"
              >
                <Bookmark className="w-20 h-20 mb-4 opacity-20" />
                <p className="text-xl font-display">No bookmarks yet</p>
                <p className="text-sm mt-2 font-body">
                  Start adding movies and TV shows!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {paginatedBookmarks.map((item, idx) => (
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
