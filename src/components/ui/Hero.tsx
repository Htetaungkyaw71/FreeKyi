import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { BACKDROP_LG, POSTER_MD } from "../../services/tmdb";
import { useBookmark } from "../../hooks/useBookmark";
import { HeroSkeleton } from "../skeletons";
import type { Movie } from "../../types";

interface HeroProps {
  movies: Movie[];
  loading?: boolean;
}

export function Hero({ movies, loading }: HeroProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { isBookmarked, toggle } = useBookmark();

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (loading) return <HeroSkeleton />;
  if (movies.length === 0) return null;

  const current = movies[currentIdx];
  if (!current) return null;

  const backdropUrl = current.backdrop_path
    ? `${BACKDROP_LG}${current.backdrop_path}`
    : null;
  const posterUrl = current.poster_path
    ? `${POSTER_MD}${current.poster_path}`
    : null;
  const year = current.release_date
    ? new Date(current.release_date).getFullYear()
    : "";
  const bookmarked = isBookmarked(current.id, "movie");

  return (
    <div className="relative w-full h-[80vh] min-h-[550px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-transparent to-cinema-bg/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 w-full">
          <div className="flex gap-6 md:gap-10 items-end">
            {/* Poster (desktop only) */}
            {posterUrl && (
              <motion.div
                key={`poster-${current.id}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:block flex-shrink-0 w-40 xl:w-48 rounded-lg overflow-hidden shadow-2xl shadow-black/50"
              >
                <img
                  src={posterUrl}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl"
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-cinema-accent text-white text-[10px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    TRENDING
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-cinema-gold fill-cinema-gold" />
                    <span className="text-white text-xs font-mono">
                      {current.vote_average.toFixed(1)}
                    </span>
                  </div>
                  {year && (
                    <span className="text-cinema-muted text-xs font-mono">
                      {year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl md:text-6xl xl:text-7xl text-white leading-none hero-text-shadow mb-3">
                  {current.title}
                </h1>

                {/* Overview */}
                <p className="text-cinema-muted text-sm md:text-base leading-relaxed line-clamp-3 mb-6 max-w-xl font-body">
                  {current.overview}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/movie/${current.id}`}
                    className="flex items-center gap-2 bg-cinema-accent hover:bg-red-700 text-white font-body font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-cinema-accent/30"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Now
                  </Link>

                  <Link
                    to={`/movie/${current.id}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-body font-semibold px-6 py-3 rounded-full transition-all duration-200 border border-white/20"
                  >
                    <Info className="w-4 h-4" />
                    More Info
                  </Link>

                  <button
                    onClick={() => toggle({ ...current, media_type: "movie" })}
                    className="hidden md:flex w-12 h-12 rounded-full items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 transition-all duration-200"
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-cinema-accent" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentIdx
                ? "w-6 h-2 bg-cinema-accent"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
