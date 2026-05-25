import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Play,
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
import { useWatchlist } from "../hooks/useWatchlist";
import type {
  MovieDetail,
  TVDetail,
  CastMember,
  Movie,
  TVSeries,
} from "../types";
import { SEO } from "../components/seo/SEO";

interface DetailPageProps {
  mediaType: "movie" | "tv";
}

interface DetailPageData {
  detail: MovieDetail | TVDetail;
  cast: CastMember[];
  recommendations: (Movie | TVSeries)[];
}

const DETAIL_CACHE_TTL = 1000 * 60 * 10;
const detailCache = new Map<
  string,
  { data: DetailPageData; updatedAt: number }
>();

function getDetailCacheKey(mediaType: "movie" | "tv", id: number) {
  return `${mediaType}:${id}`;
}

function getFreshDetailCache(key: string) {
  const cached = detailCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= DETAIL_CACHE_TTL) return null;
  return cached.data;
}

function getStoredProgress(id: number) {
  try {
    const raw = localStorage.getItem(`cinemaflow:lastWatched:${id}`);
    if (!raw) return { season: 1, episode: 1 };
    const p = JSON.parse(raw);
    return {
      season: Number(p?.season) || 1,
      episode: Number(p?.episode) || 1,
    };
  } catch {
    return { season: 1, episode: 1 };
  }
}

export default function Detail({ mediaType }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const detailCacheKey = getDetailCacheKey(mediaType, numId);
  const initialDetailData = getFreshDetailCache(detailCacheKey);

  const [detail, setDetail] = useState<MovieDetail | TVDetail | null>(
    () => initialDetailData?.detail ?? null,
  );
  const [cast, setCast] = useState<CastMember[]>(
    () => initialDetailData?.cast ?? [],
  );
  const [recommendations, setRecommendations] = useState<(Movie | TVSeries)[]>(
    () => initialDetailData?.recommendations ?? [],
  );
  const [loading, setLoading] = useState(() => !initialDetailData);
  const [season, setSeason] = useState(() =>
    mediaType === "tv" ? getStoredProgress(numId).season : 1,
  );
  const [episode, setEpisode] = useState(() =>
    mediaType === "tv" ? getStoredProgress(numId).episode : 1,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const { isBookmarked, toggle } = useBookmark();
  const bookmarked = detail ? isBookmarked(numId, mediaType) : false;

  const { addW } = useWatchlist();

  const STORAGE_KEY = `cinemaflow:lastWatched:${numId}`;

  useEffect(() => {
    if (!numId) return;

    const cachedData = getFreshDetailCache(detailCacheKey);
    if (cachedData) {
      setDetail(cachedData.detail);
      setCast(cachedData.cast);
      setRecommendations(cachedData.recommendations);
      setLoading(false);
      return;
    }

    let isActive = true;
    setDetail(null);
    setCast([]);
    setRecommendations([]);
    setLoading(true);

    const fetchAll = async () => {
      try {
        if (mediaType === "movie") {
          const [det, cred, recs] = await Promise.all([
            getMovieDetails(numId),
            getMovieCredits(numId),
            getMovieRecommendations(numId),
          ]);
          const data = {
            detail: det.data,
            cast: cred.data.cast.slice(0, 10),
            recommendations: recs.data.results,
          };
          detailCache.set(detailCacheKey, { data, updatedAt: Date.now() });
          if (!isActive) return;
          setDetail(data.detail);
          setCast(data.cast);
          setRecommendations(data.recommendations);
        } else {
          const [det, cred, recs] = await Promise.all([
            getTVDetails(numId),
            getTVCredits(numId),
            getTVRecommendations(numId),
          ]);
          const data = {
            detail: det.data,
            cast: cred.data.cast.slice(0, 10),
            recommendations: recs.data.results,
          };
          detailCache.set(detailCacheKey, { data, updatedAt: Date.now() });
          if (!isActive) return;
          setDetail(data.detail);
          setCast(data.cast);
          setRecommendations(data.recommendations);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchAll();

    return () => {
      isActive = false;
    };
  }, [numId, mediaType, detailCacheKey]);

  useEffect(() => {
    setIsPlaying(false);
    if (mediaType !== "tv") return;
    const p = getStoredProgress(numId);
    setSeason(p.season);
    setEpisode(p.episode);
  }, [numId, mediaType]);

  useEffect(() => {
    if (!numId || mediaType !== "tv") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ season, episode }));
    } catch {
      // ignore
    }
  }, [season, episode, numId, mediaType, STORAGE_KEY]);

  if (loading)
    return (
      <>
        <SEO
          title={mediaType === "movie" ? "Loading Movie" : "Loading TV Series"}
          description="Loading title details on FreeKyi."
          path={`/${mediaType}/${numId}`}
        />
        <DetailSkeleton mediaType={mediaType} />
      </>
    );
  if (!detail)
    return (
      <>
        <SEO
          title="Title Not Found"
          description="This movie or TV series could not be found on FreeKyi."
          path={`/${mediaType}/${numId}`}
          noIndex
        />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-cinema-muted font-display text-2xl">Not Found</p>
        </div>
      </>
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
  const currentEpisodeCount =
    tvSeasons.find((s) => s.season_number === season)?.episode_count ?? 1;
  const showEpisodeGrid = currentEpisodeCount > 12;
  const seoTitle =
    mediaType === "movie"
      ? `Watch ${title} Online Free${year ? ` (${year})` : ""}`
      : `Watch ${title} TV Series Online Free${year ? ` (${year})` : ""}`;
  const seoDescription = detail.overview
    ? `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. ${detail.overview}`
    : `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. Find details, cast, ratings, and recommendations.`;
  const seoImage = posterUrl || backdropUrl;
  const schemaType = mediaType === "movie" ? "Movie" : "TVSeries";

  const formatRuntime = (mins: number) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/${mediaType}/${numId}`}
        image={seoImage}
        imageAlt={`${title} poster`}
        type={mediaType === "movie" ? "video.movie" : "video.tv_show"}
        keywords={[
          `${title} free`,
          `watch ${title} online`,
          `${title} ${mediaType === "movie" ? "movie" : "series"}`,
          ...(year ? [`${title} ${year}`] : []),
          ...detail.genres.map((g) => `${g.name} ${mediaType}`),
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": schemaType,
          name: title,
          description: detail.overview || seoDescription,
          image: seoImage || undefined,
          url: `https://freekyi.vercel.app/${mediaType}/${numId}`,
          datePublished: releaseDate || undefined,
          genre: detail.genres.map((g) => g.name),
          aggregateRating:
            detail.vote_count > 0
              ? {
                  "@type": "AggregateRating",
                  ratingValue: detail.vote_average.toFixed(1),
                  bestRating: "10",
                  ratingCount: detail.vote_count,
                }
              : undefined,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        {/* ── THEATER ZONE ─────────────────────────────────────────────────────── */}
        <div className="relative w-full bg-black">
          {/* Blurred backdrop ambiance */}
          {backdropUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-105"
              style={{ backgroundImage: `url(${backdropUrl})` }}
              aria-hidden="true"
            />
          )}

          {/* Player */}
          <div className="top-0 z-[80] max-w-screen-2xl mx-auto bg-black pb-4 shadow-2xl shadow-black/70 md:relative md:top-auto md:z-10 md:shadow-none">
            {isPlaying ? (
              <EmbedPlayer embedUrl={embedUrl} title={title} />
            ) : (
              <div
                onClick={() => {
                  if (detail) {
                    addW({
                      ...detail,
                      media_type: mediaType,
                      genre_ids: detail.genres.map((g) => g.id),
                    } as (Movie | TVSeries) & {
                      media_type: "movie" | "tv";
                    });
                  }
                  setIsPlaying(true);
                }}
                className="relative w-full aspect-video bg-cinema-hover overflow-hidden group cursor-pointer shadow-2xl shadow-black/60"
              >
                {(backdropUrl || posterUrl) && (
                  <img
                    src={backdropUrl || posterUrl || ""}
                    alt={`Play ${title}`}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-cinema-accent/90 rounded-full flex items-center justify-center pl-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                  </div>
                  {mediaType === "tv" && (
                    <span className="text-white/80 text-sm font-body bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      S{season} · E{episode}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {mediaType === "tv" &&
            tvSeasons.filter((s) => s.season_number > 0).length > 0 && (
              <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8 pt-4 pb-8 flex flex-col md:flex-row md:items-start gap-3">
                {/* Season dropdown */}
                <div className="relative w-full md:w-auto">
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                      setIsPlaying(false);
                    }}
                    className="w-full md:w-auto bg-cinema-card border border-cinema-border text-cinema-text text-sm px-4 py-2 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-cinema-accent"
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

                {/* Episode pill buttons — scrollable row */}
                <div className="relative w-full md:flex-1">
                  <div className="episode-scroll-fade overflow-x-auto scrollbar-hide px-2 md:px-0">
                    <div
                      className={
                        showEpisodeGrid
                          ? "grid grid-flow-col grid-rows-3 auto-cols-max gap-2 pb-1"
                          : "flex gap-2 pb-1"
                      }
                    >
                      {Array.from({
                        length: currentEpisodeCount,
                      }).map((_, idx) => {
                        const ep = idx + 1;
                        return (
                          <button
                            key={ep}
                            onClick={() => {
                              setEpisode(ep);
                              setIsPlaying(false);
                            }}
                            className={`px-2.5 py-2 md:px-3 md:py-2 rounded-lg text-[13px] md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                              ep === episode
                                ? "bg-cinema-accent text-white shadow-lg shadow-cinema-accent/30"
                                : "bg-cinema-card text-cinema-text border border-cinema-border hover:border-cinema-accent"
                            }`}
                          >
                            Ep {ep}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* ── METADATA ZONE ────────────────────────────────────────────────────── */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            {posterUrl && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="hidden sm:block flex-shrink-0 w-36 md:w-44 lg:w-52 rounded-xl overflow-hidden shadow-2xl shadow-black/50 self-start"
              >
                <img src={posterUrl} alt={title} className="w-full" />
              </motion.div>
            )}

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              {/* Genre chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {detail.genres?.map((g) => (
                  <Link
                    key={g.id}
                    to={`/${mediaType === "movie" ? "movies" : "tv"}?genre=${g.id}`}
                    className="text-xs bg-cinema-hover border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent px-3 py-1 rounded-full font-body transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-5xl text-white hero-text-shadow mb-2">
                {title}
              </h1>
              {detail.tagline && (
                <p className="text-cinema-muted italic font-body mb-4">
                  "{detail.tagline}"
                </p>
              )}

              {/* Meta row */}
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

          {/* Cast */}
          {cast.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-white mb-5">Cast</h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {cast.map((member) => (
                  <div
                    key={member.id}
                    className="flex-shrink-0 w-24 text-center"
                  >
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
            <div className="mt-12 -mx-4 md:-mx-8">
              <CategoryRow
                title="You Might Also Like"
                items={recommendations}
                type={mediaType}
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
