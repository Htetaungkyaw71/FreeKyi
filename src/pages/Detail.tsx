import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
} from "lucide-react";
import { EmbedPlayer } from "../components/player/VideoPlayer";
import { CategoryRow } from "../components/ui/CategoryRow";
import { DetailSkeleton } from "../components/skeletons";
import {
  getMovieDetails,
  getTVDetails,
  getMovieCredits,
  getTVCredits,
  getMovieRecommendations,
  getTVRecommendations,
  getEmbedUrl,
  BACKDROP_LG,
  POSTER_LG,
} from "../services/tmdb";
import { useBookmark } from "../hooks/useBookmark";
import type {
  MovieDetail,
  TVDetail,
  CastMember,
  Movie,
  TVSeries,
} from "../types";

interface DetailPageProps {
  mediaType: "movie" | "tv";
}

export default function Detail({ mediaType }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);

  const [detail, setDetail] = useState<MovieDetail | TVDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<(Movie | TVSeries)[]>(
    [],
  );
  console.log(detail);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const { isBookmarked, toggle } = useBookmark();
  const bookmarked = detail ? isBookmarked(numId, mediaType) : false;

  useEffect(() => {
    if (!numId) return;
    setLoading(true);
    setDetail(null);

    const fetchAll = async () => {
      try {
        if (mediaType === "movie") {
          const [det, cred, recs] = await Promise.all([
            getMovieDetails(numId),
            getMovieCredits(numId),
            getMovieRecommendations(numId),
          ]);
          setDetail(det.data);
          setCast(cred.data.cast.slice(0, 10));
          setRecommendations(recs.data.results);
        } else {
          const [det, cred, recs] = await Promise.all([
            getTVDetails(numId),
            getTVCredits(numId),
            getTVRecommendations(numId),
          ]);
          setDetail(det.data);
          setCast(cred.data.cast.slice(0, 10));
          setRecommendations(recs.data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numId, mediaType]);

  if (loading) return <DetailSkeleton />;
  if (!detail)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted font-display text-2xl">Not Found</p>
      </div>
    );

  const title =
    (detail as MovieDetail).title ?? (detail as TVDetail).name ?? "";
  const backdropUrl = detail.backdrop_path
    ? `${BACKDROP_LG}${detail.backdrop_path}`
    : null;
  const posterUrl = detail.poster_path
    ? `${POSTER_LG}${detail.poster_path}`
    : null;
  const releaseDate =
    (detail as MovieDetail).release_date ??
    (detail as TVDetail).first_air_date ??
    "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const runtime = (detail as MovieDetail).runtime;
  const seasons = (detail as TVDetail).number_of_seasons;
  const episodes = (detail as TVDetail).number_of_episodes;
  const tvSeasons = (detail as TVDetail).seasons ?? [];
  const embedUrl = getEmbedUrl(numId, mediaType, season, episode);

  const formatRuntime = (mins: number) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-cinema-hover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/40 to-cinema-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/80 to-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {posterUrl && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 w-36 md:w-52 lg:w-64 rounded-xl overflow-hidden shadow-2xl shadow-black/60 self-start"
            >
              <img src={posterUrl} alt={title} className="w-full" />
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {detail.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs bg-cinema-hover border border-cinema-border text-cinema-muted px-3 py-1 rounded-full font-body"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl text-white hero-text-shadow mb-2">
              {title}
            </h1>
            {detail.tagline && (
              <p className="text-cinema-muted italic font-body mb-4">
                "{detail.tagline}"
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm font-body">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-cinema-gold fill-cinema-gold" />
                <span className="text-white font-semibold">
                  {detail.vote_average.toFixed(1)}
                </span>
                <span className="text-cinema-muted">/ 10</span>
              </div>
              {year && (
                <div className="flex items-center gap-1.5 text-cinema-muted">
                  <Calendar className="w-4 h-4" />
                  {year}
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1.5 text-cinema-muted">
                  <Clock className="w-4 h-4" />
                  {formatRuntime(runtime)}
                </div>
              )}
              {seasons && (
                <span className="text-cinema-muted">
                  {seasons} Season{seasons !== 1 ? "s" : ""}
                </span>
              )}
              {episodes && (
                <span className="text-cinema-muted">{episodes} Episodes</span>
              )}
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  detail.status === "Released" ||
                  detail.status === "Ended" ||
                  detail.status === "Returning Series"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-yellow-900/50 text-yellow-400"
                }`}
              >
                {detail.status}
              </span>
            </div>

            {/* Overview */}
            <p className="text-cinema-text leading-relaxed font-body max-w-2xl mb-6">
              {detail.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  detail &&
                  toggle({
                    ...detail,
                    media_type: mediaType,
                    genre_ids: detail.genres.map((g) => g.id),
                  } as (Movie | TVSeries) & { media_type: "movie" | "tv" })
                }
                className="flex items-center gap-2 bg-cinema-hover border border-cinema-border text-white font-body font-medium px-5 py-3 rounded-full transition-all duration-200 hover:border-cinema-accent"
              >
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-cinema-accent" />{" "}
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Add Bookmark
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Player Section */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-10"
        >
          <h2 className="font-display text-2xl text-white mb-4">Now Playing</h2>

          {/* TV Episode Selector */}
          {mediaType === "tv" &&
            tvSeasons.filter((s) => s.season_number > 0).length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                <div className="relative">
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                    }}
                    className="bg-cinema-card border border-cinema-border text-cinema-text text-sm px-4 py-2 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-cinema-accent"
                  >
                    {tvSeasons
                      .filter((s) => s.season_number > 0)
                      .map((s) => (
                        <option key={s.id} value={s.season_number}>
                          Season {s.season_number}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="bg-cinema-card border border-cinema-border text-cinema-text text-sm px-4 py-2 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-cinema-accent"
                  >
                    {Array.from(
                      {
                        length:
                          tvSeasons.find((s) => s.season_number === season)
                            ?.episode_count ?? 1,
                      },
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Episode {i + 1}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted pointer-events-none" />
                </div>
              </div>
            )}

          <EmbedPlayer embedUrl={embedUrl} title={title} />
        </motion.div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-white mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-cinema-hover mb-2 mx-auto">
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cinema-muted text-2xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-cinema-text text-xs font-body font-medium leading-tight">
                    {member.name}
                  </p>
                  <p className="text-cinema-muted text-[11px] font-body leading-tight mt-0.5 line-clamp-2">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <CategoryRow
              title="You Might Also Like"
              items={recommendations}
              type={mediaType}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
