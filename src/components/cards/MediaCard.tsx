// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Star, Bookmark, BookmarkCheck, Play, X } from "lucide-react";
// import { POSTER_MD } from "../../services/tmdb";
// import { useBookmark } from "../../hooks/useBookmark";
// import { useWatchlist } from "../../hooks/useWatchlist";
// import type { Movie, TVSeries } from "../../types";

// interface MediaCardProps {
//   item: (Movie | TVSeries) & { media_type?: "movie" | "tv" };
//   type?: "movie" | "tv";
//   index?: number;
// }

// export function MediaCard({ item, type = "movie", index = 0 }: MediaCardProps) {
//   const mediaType = item.media_type ?? type;
//   const title = (item as Movie).title ?? (item as TVSeries).name ?? "";
//   const releaseDate =
//     (item as Movie).release_date ?? (item as TVSeries).first_air_date ?? "";
//   const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
//   const posterUrl = item.poster_path ? `${POSTER_MD}${item.poster_path}` : null;

//   const { isBookmarked, toggle } = useBookmark();
//   const bookmarked = isBookmarked(item.id, mediaType);

//   const { isWatchlisted, removeW } = useWatchlist();
//   const watchlisted = isWatchlisted(item.id, mediaType);

//   const handleBookmark = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     toggle({ ...item, media_type: mediaType } as (
//       | import("../../types").Movie
//       | import("../../types").TVSeries
//     ) & { media_type: "movie" | "tv" });
//   };

//   const handleRemoveWatchlist = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     removeW(item.id, mediaType);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.05, duration: 0.3 }}
//       className="group relative"
//     >
//       <Link to={`/${mediaType}/${item.id}`} className="block">
//         <div className="relative rounded-lg overflow-hidden bg-cinema-card aspect-[2/3]">
//           {posterUrl ? (
//             <img
//               src={posterUrl}
//               alt={title}
//               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//               loading="lazy"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-cinema-hover text-cinema-muted text-xs text-center px-2">
//               {title}
//             </div>
//           )}

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//           {/* Play button */}
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="w-12 h-12 rounded-full bg-cinema-accent/90 flex items-center justify-center backdrop-blur-sm">
//               <Play className="w-5 h-5 text-white fill-white ml-0.5" />
//             </div>
//           </div>

//           {/* Rating badge */}
//           <div className="absolute top-2 left-2">
//             <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
//               <Star className="w-3 h-3 text-cinema-gold fill-cinema-gold" />
//               <span className="text-xs text-white font-mono">
//                 {item.vote_average.toFixed(1)}
//               </span>
//             </div>
//           </div>

//           {/* Bookmark button */}
//           <button
//             onClick={handleBookmark}
//             className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-cinema-accent"
//           >
//             {bookmarked ? (
//               <BookmarkCheck className="w-4 h-4 text-white" />
//             ) : (
//               <Bookmark className="w-4 h-4 text-white" />
//             )}
//           </button>

//           {/* Remove Watchlist button (only show if in watchlist) */}
//           {watchlisted && (
//             <button
//               onClick={handleRemoveWatchlist}
//               title="Remove from Continue Watching"
//               className="absolute top-12 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500"
//             >
//               <X className="w-4 h-4 text-white" />
//             </button>
//           )}

//           {/* Type badge */}
//           <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <span className="text-[10px] uppercase tracking-wider bg-cinema-accent/90 text-white px-1.5 py-0.5 rounded font-body font-semibold">
//               {mediaType === "tv" ? "TV" : "Movie"}
//             </span>
//           </div>
//         </div>

//         <div className="mt-2 px-0.5">
//           <h3 className="text-sm font-body font-medium text-cinema-text truncate group-hover:text-cinema-accent transition-colors">
//             {title}
//           </h3>
//           {year && (
//             <p className="text-xs text-cinema-muted font-mono">{year}</p>
//           )}
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, Play, X } from "lucide-react";
import { POSTER_MD } from "../../services/tmdb";
import { useBookmark } from "../../hooks/useBookmark";
import { useWatchlist } from "../../hooks/useWatchlist";
import type { Movie, TVSeries } from "../../types";
import { getMediaPath } from "../../utils/mediaUrls";

interface MediaCardProps {
  item: (Movie | TVSeries) & { media_type?: "movie" | "tv" };
  type?: "movie" | "tv";
  index?: number;
}

export function MediaCard({ item, type = "movie", index = 0 }: MediaCardProps) {
  const location = useLocation();
  // Check if the current URL path is the watchlist page
  const isWatchlistRoute = location.pathname === "/watchlist";

  const mediaType = item.media_type ?? type;
  const title = (item as Movie).title ?? (item as TVSeries).name ?? "";
  const releaseDate =
    (item as Movie).release_date ?? (item as TVSeries).first_air_date ?? "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const posterUrl = item.poster_path ? `${POSTER_MD}${item.poster_path}` : null;

  const { isBookmarked, toggle } = useBookmark();
  const bookmarked = isBookmarked(item.id, mediaType);

  const { isWatchlisted, removeW } = useWatchlist();
  const watchlisted = isWatchlisted(item.id, mediaType);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({ ...item, media_type: mediaType } as (
      | import("../../types").Movie
      | import("../../types").TVSeries
    ) & { media_type: "movie" | "tv" });
  };

  const handleRemoveWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeW(item.id, mediaType);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative"
    >
      <Link to={getMediaPath(mediaType, item)} className="block">
        <div className="relative rounded-lg overflow-hidden bg-cinema-card aspect-[2/3]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cinema-hover text-cinema-muted text-xs text-center px-2">
              {title}
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-cinema-accent/90 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5">
              <Star className="w-3 h-3 text-cinema-gold fill-cinema-gold" />
              <span className="text-xs text-white font-mono">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Action Button Area (Swaps depending on route) */}
          {isWatchlistRoute ? (
            /* ONLY show Remove Watchlist button when inside the watchlist route */
            <button
              onClick={handleRemoveWatchlist}
              title="Remove from Watchlist"
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          ) : (
            /* Otherwise, show standard Bookmark & separate watchlist indicator logic everywhere else */
            <>
              <button
                onClick={handleBookmark}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-cinema-accent"
              >
                {bookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-white" />
                ) : (
                  <Bookmark className="w-4 h-4 text-white" />
                )}
              </button>

              {watchlisted && location.pathname.includes("/watchlist") && (
                <button
                  onClick={handleRemoveWatchlist}
                  title="Remove from Continue Watching"
                  className="absolute top-12 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          )}

          {/* Type badge */}
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] uppercase tracking-wider bg-cinema-accent/90 text-white px-1.5 py-0.5 rounded font-body font-semibold">
              {mediaType === "tv" ? "TV" : "Movie"}
            </span>
          </div>
        </div>

        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-body font-medium text-cinema-text truncate group-hover:text-cinema-accent transition-colors">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-cinema-muted font-mono">{year}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
