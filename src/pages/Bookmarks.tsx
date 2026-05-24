import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { MediaCard } from '../components/cards/MediaCard';
import { useAppSelector } from '../hooks/useStore';

export default function Bookmarks() {
  const bookmarks = useAppSelector((s) => s.bookmarks.items);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-16"
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-white">My Bookmarks</h1>
          <p className="text-cinema-muted text-sm font-body mt-1">
            {bookmarks.length} saved {bookmarks.length === 1 ? 'title' : 'titles'}
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
              <p className="text-sm mt-2 font-body">Start adding movies and TV shows!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
            >
              {bookmarks.map((item, idx) => (
                <MediaCard
                  key={`${item.id}-${item.media_type}`}
                  item={item}
                  type={item.media_type}
                  index={idx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
