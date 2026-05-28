import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Play,
  Send,
  Share2,
  Clapperboard,
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
  getTVSeasonDetails,
  BACKDROP_LG,
  IMAGE_BASE,
  POSTER_LG,
} from "../services/tmdb";
import { getVideoServers } from "../services/videoServers";
import { useBookmark } from "../hooks/useBookmark";
import { useWatchlist } from "../hooks/useWatchlist";
import type {
  MovieDetail,
  TVDetail,
  CastMember,
  Episode,
  Movie,
  TVSeries,
} from "../types";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { parseMediaId, slugifyTitle } from "../utils/mediaUrls";

interface DetailPageProps {
  mediaType: "movie" | "tv";
}

interface DetailPageData {
  detail: MovieDetail | TVDetail;
  cast: CastMember[];
  recommendations: (Movie | TVSeries)[];
}

const DETAIL_CACHE_TTL = 1000 * 60 * 10;
const SEASON_CACHE_TTL = 1000 * 60 * 10;
const detailCache = new Map<
  string,
  { data: DetailPageData; updatedAt: number }
>();
const seasonCache = new Map<
  string,
  { data: Episode[]; updatedAt: number }
>();

function getDetailCacheKey(mediaType: "movie" | "tv", id: number) {
  return `${mediaType}:${id}`;
}

function getSeasonCacheKey(id: number, seasonNumber: number) {
  return `tv:${id}:season:${seasonNumber}`;
}

function getFreshDetailCache(key: string) {
  const cached = detailCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= DETAIL_CACHE_TTL) return null;
  return cached.data;
}

function getFreshSeasonCache(key: string) {
  const cached = seasonCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= SEASON_CACHE_TTL) return null;
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

function shouldUseNativeShare() {
  if (!navigator.share) return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /android|iphone|ipad|ipod/.test(userAgent);
  const isTouchDevice = navigator.maxTouchPoints > 1;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

  return isMobileUserAgent || isTouchDevice || isCoarsePointer || isSmallScreen;
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatEpisodeRuntime(mins: number | null) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function EpisodeCard({
  item,
  active,
  onSelect,
}: {
  item: Episode;
  active: boolean;
  onSelect: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const stillUrl =
    item.still_path && !imageFailed
      ? `${IMAGE_BASE}/w300${item.still_path}`
      : null;
  const runtime = formatEpisodeRuntime(item.runtime);
  const episodeTitle = item.name || `Episode ${item.episode_number}`;

  useEffect(() => {
    setImageFailed(false);
  }, [item.still_path]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group grid min-h-[104px] grid-cols-[112px_1fr] overflow-hidden rounded-xl border text-left transition-all duration-200 sm:grid-cols-[132px_1fr] ${
        active
          ? "border-cinema-accent bg-cinema-hover shadow-lg shadow-cinema-accent/10"
          : "border-cinema-border bg-cinema-card hover:border-cinema-accent/70 hover:bg-cinema-hover"
      }`}
    >
      <div className="relative h-full min-h-[104px] bg-gradient-to-br from-cinema-hover via-cinema-card to-black">
        {stillUrl ? (
          <img
            src={stillUrl}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-75"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/25 text-cinema-muted">
              <Clapperboard className="h-5 w-5" />
            </div>
          </div>
        )}
        <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-body font-semibold text-white">
          Ep {item.episode_number}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-body font-semibold leading-snug text-white">
            {episodeTitle}
          </h3>
          {runtime && (
            <span className="flex-shrink-0 text-[11px] font-body text-cinema-muted">
              {runtime}
            </span>
          )}
        </div>
        {item.overview && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-cinema-muted">
            {item.overview}
          </p>
        )}
        {active && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-cinema-accent px-2 py-0.5 text-[11px] font-body font-semibold text-white">
            <Play className="h-3 w-3 fill-white" />
            Selected
          </span>
        )}
      </div>
    </button>
  );
}

function CastAvatar({ member }: { member: CastMember }) {
  const [imageFailed, setImageFailed] = useState(false);
  const profileUrl =
    member.profile_path && !imageFailed
      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
      : null;
  const initials = getInitials(member.name) || "?";

  useEffect(() => {
    setImageFailed(false);
  }, [member.profile_path]);

  return (
    <div className="mb-2 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-cinema-hover via-cinema-card to-black shadow-lg shadow-black/25">
      {profileUrl ? (
        <img
          src={profileUrl}
          alt={member.name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="text-lg font-body font-semibold tracking-wide text-cinema-muted">
          {initials}
        </span>
      )}
    </div>
  );
}

export default function Detail({ mediaType }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const numId = parseMediaId(id);
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
  const [episodeListSeason, setEpisodeListSeason] = useState(() =>
    mediaType === "tv" ? getStoredProgress(numId).season : 1,
  );
  const [episode, setEpisode] = useState(() =>
    mediaType === "tv" ? getStoredProgress(numId).episode : 1,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState("server-1");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [posterImageFailed, setPosterImageFailed] = useState(false);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [seasonEpisodesLoading, setSeasonEpisodesLoading] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);

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
    setEpisodeListSeason(p.season);
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

  useEffect(() => {
    if (!numId || mediaType !== "tv") {
      setSeasonEpisodes([]);
      setSeasonEpisodesLoading(false);
      return;
    }

    const seasonCacheKey = getSeasonCacheKey(numId, episodeListSeason);
    const cachedEpisodes = getFreshSeasonCache(seasonCacheKey);
    if (cachedEpisodes) {
      setSeasonEpisodes(cachedEpisodes);
      setSeasonEpisodesLoading(false);
      return;
    }

    let isActive = true;
    setSeasonEpisodes([]);
    setSeasonEpisodesLoading(true);

    getTVSeasonDetails(numId, episodeListSeason)
      .then((response) => {
        const episodes = response.data.episodes ?? [];
        seasonCache.set(seasonCacheKey, {
          data: episodes,
          updatedAt: Date.now(),
        });
        if (isActive) setSeasonEpisodes(episodes);
      })
      .catch((error) => {
        console.error(error);
        if (isActive) setSeasonEpisodes([]);
      })
      .finally(() => {
        if (isActive) setSeasonEpisodesLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [numId, mediaType, episodeListSeason]);

  useEffect(() => {
    if (!shareOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShareOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [shareOpen]);

  useEffect(() => {
    setHeroImageFailed(false);
    setPosterImageFailed(false);
  }, [detail?.backdrop_path, detail?.poster_path]);

  const videoServers = useMemo(
    () => getVideoServers({ id: numId, type: mediaType, season, episode }),
    [numId, mediaType, season, episode],
  );

  useEffect(() => {
    if (
      videoServers.length > 0 &&
      !videoServers.some((server) => server.id === selectedServerId)
    ) {
      setSelectedServerId(videoServers[0].id);
    }
  }, [selectedServerId, videoServers]);

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
  const playerImageUrl = heroImageFailed ? null : backdropUrl || posterUrl;
  const detailPosterUrl = posterImageFailed ? null : posterUrl;
  const releaseDate =
    (detail as MovieDetail).release_date ??
    (detail as TVDetail).first_air_date ??
    "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const runtime = (detail as MovieDetail).runtime;
  const seasons = (detail as TVDetail).number_of_seasons;
  const episodes = (detail as TVDetail).number_of_episodes;
  const tvSeasons = (detail as TVDetail).seasons ?? [];
  const visibleTvSeasons = tvSeasons.filter((s) => s.season_number > 0);
  const selectedVideoServer =
    videoServers.find((server) => server.id === selectedServerId) ??
    videoServers[0];
  const embedUrl = selectedVideoServer?.embedUrl ?? "about:blank";
  const currentEpisodeCount =
    tvSeasons.find((s) => s.season_number === episodeListSeason)
      ?.episode_count ?? 1;
  const showEpisodeGrid = currentEpisodeCount > 12;
  const largestSeasonEpisodeCount = visibleTvSeasons.reduce(
    (maxCount, item) => Math.max(maxCount, item.episode_count),
    0,
  );
  const showRichEpisodeCards =
    largestSeasonEpisodeCount > 0 && largestSeasonEpisodeCount <= 20;
  const episodeCards = Array.from({ length: currentEpisodeCount }).map(
    (_, idx) => {
      const episodeNumber = idx + 1;
      return (
        seasonEpisodes.find((item) => item.episode_number === episodeNumber) ??
        {
          id: -episodeNumber,
          name: `Episode ${episodeNumber}`,
          overview: "",
          episode_number: episodeNumber,
          season_number: episodeListSeason,
          still_path: null,
          air_date: "",
          runtime: null,
          vote_average: 0,
        }
      );
    },
  );
  const seoTitle =
    mediaType === "movie"
      ? `Watch ${title} Online Free${year ? ` (${year})` : ""}`
      : `Watch ${title} TV Series Online Free${year ? ` (${year})` : ""}`;
  const seoDescription = detail.overview
    ? `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. ${detail.overview}`
    : `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. Find details, cast, ratings, and recommendations.`;
  const seoImage = posterUrl || backdropUrl;
  const schemaType = mediaType === "movie" ? "Movie" : "TVSeries";
  const titleSlug = slugifyTitle(title);
  const canonicalPath = `/${mediaType}/${numId}${titleSlug ? `-${titleSlug}` : ""}`;
  const shareUrl = `${window.location.origin}${canonicalPath}`;
  const shareText = `Watch ${title} on FreeKyi`;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      icon: ExternalLink,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareText}`,
      icon: ExternalLink,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareText}`,
      icon: Send,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedShareText}%20${encodedShareUrl}`,
      icon: MessageCircle,
    },
  ];

  const formatRuntime = (mins: number) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleCopyShareLink = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    if (shouldUseNativeShare()) {
      try {
        const shareData = {
          title,
          text: shareText,
          url: shareUrl,
        };

        if (navigator.canShare && !navigator.canShare(shareData)) {
          setShareOpen((value) => !value);
          return;
        }

        await navigator.share(shareData);
        setShareOpen(false);
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }

    setShareOpen((value) => !value);
  };

  const jumpToPlayer = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setEpisodeListSeason(seasonNumber);
  };

  const handleEpisodeChange = (episodeNumber: number) => {
    setSeason(episodeListSeason);
    setEpisode(episodeNumber);
    setIsPlaying(false);
    jumpToPlayer();
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={canonicalPath}
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
          url: `${seoConfig.siteUrl}${canonicalPath}`,
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
            <div className="relative w-full aspect-video overflow-hidden bg-black shadow-2xl shadow-black/60">
              <EmbedPlayer
                key={selectedVideoServer?.id ?? embedUrl}
                embedUrl={embedUrl}
                title={title}
                className="shadow-none"
              />

              {!isPlaying && (
                <button
                  type="button"
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
                  className="absolute inset-0 z-30 w-full cursor-pointer overflow-hidden bg-cinema-hover text-left group"
                  aria-label={`Play ${title}`}
                >
                  {!playerImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cinema-card via-[#15172a] to-black">
                      <div className="flex flex-col items-center gap-2 px-6 text-center text-cinema-muted">
                        <Clapperboard className="h-8 w-8 opacity-50" />
                        <span className="line-clamp-1 max-w-xs text-xs font-body uppercase tracking-widest opacity-60">
                          Preview unavailable
                        </span>
                      </div>
                    </div>
                  )}
                  {playerImageUrl && (
                    <img
                      src={playerImageUrl}
                      alt=""
                      className="relative z-10 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                      decoding="async"
                      onError={() => setHeroImageFailed(true)}
                    />
                  )}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-cinema-accent/90 rounded-full flex items-center justify-center pl-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                    </div>
                    {mediaType === "tv" && (
                      <span className="text-white/80 text-sm font-body bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        S{season} · E{episode}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </div>

            {videoServers.length > 1 && (
              <div className="px-4 py-4 md:px-8">
                <p className="mb-3 text-xs font-body text-cinema-muted">
                  If this server does not work, please switch to another
                  server.
                </p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {videoServers.map((server, index) => (
                    <button
                      key={server.id}
                      type="button"
                      onClick={() => {
                        setSelectedServerId(server.id);
                        setIsPlaying(false);
                      }}
                      className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-body font-semibold transition-colors ${
                        server.id === selectedVideoServer?.id
                          ? "border-cinema-accent bg-cinema-accent text-white"
                          : "border-cinema-border bg-cinema-card text-cinema-muted hover:border-cinema-accent hover:text-white"
                      }`}
                    >
                      Server {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mediaType === "tv" &&
            visibleTvSeasons.length > 0 && (
              <div className="relative z-10 max-w-screen-2xl mx-auto px-4 md:px-8 pt-4 pb-8">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Season dropdown */}
                  <div className="relative w-full sm:w-52">
                    <select
                      value={episodeListSeason}
                      onChange={(e) => {
                        handleSeasonChange(Number(e.target.value));
                      }}
                      className="w-full bg-cinema-card border border-cinema-border text-cinema-text text-sm px-4 py-2 pr-8 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-cinema-accent"
                    >
                      {visibleTvSeasons.map((s) => (
                        <option key={s.id} value={s.season_number}>
                          Season {s.season_number}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted pointer-events-none" />
                  </div>

                  {showRichEpisodeCards && (
                    <p className="text-xs font-body text-cinema-muted">
                      {currentEpisodeCount} episodes
                    </p>
                  )}
                </div>

                {showRichEpisodeCards && seasonEpisodesLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: Math.min(currentEpisodeCount, 6) }).map(
                      (_, idx) => (
                        <div
                          key={idx}
                          className="grid min-h-[104px] grid-cols-[112px_1fr] overflow-hidden rounded-xl border border-cinema-border bg-cinema-card sm:grid-cols-[132px_1fr]"
                        >
                          <div className="skeleton h-full min-h-[104px]" />
                          <div className="space-y-3 p-3">
                            <div className="skeleton h-4 w-3/4 rounded" />
                            <div className="skeleton h-3 w-full rounded" />
                            <div className="skeleton h-3 w-2/3 rounded" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : showRichEpisodeCards ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {episodeCards.map((item) => (
                      <EpisodeCard
                        key={item.id}
                        item={item}
                        active={
                          episodeListSeason === season &&
                          item.episode_number === episode
                        }
                        onSelect={() => {
                          handleEpisodeChange(item.episode_number);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="relative w-full">
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
                                handleEpisodeChange(ep);
                              }}
                              className={`px-2.5 py-2 md:px-3 md:py-2 rounded-lg text-[13px] md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                                episodeListSeason === season && ep === episode
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
                )}
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
                className="hidden sm:block flex-shrink-0 w-36 md:w-44 lg:w-52 rounded-xl overflow-hidden bg-cinema-card shadow-2xl shadow-black/50 self-start"
              >
                {detailPosterUrl ? (
                  <img
                    src={detailPosterUrl}
                    alt={title}
                    className="w-full"
                    loading="lazy"
                    decoding="async"
                    onError={() => setPosterImageFailed(true)}
                  />
                ) : (
                  <div className="flex aspect-[2/3] flex-col items-center justify-center gap-2 bg-gradient-to-br from-cinema-hover via-cinema-card to-black p-4 text-center text-cinema-muted">
                    <Clapperboard className="h-8 w-8 opacity-60" />
                    <p className="line-clamp-3 text-xs font-body font-medium text-cinema-text">
                      {title}
                    </p>
                  </div>
                )}
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
                <div className="relative" ref={shareMenuRef}>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-cinema-hover border border-cinema-border text-white font-body font-medium px-5 py-3 rounded-full transition-all duration-200 hover:border-cinema-accent"
                    aria-expanded={shareOpen}
                    aria-haspopup="menu"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>

                  {shareOpen && (
                    <div
                      className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-xl border border-cinema-border bg-cinema-card shadow-2xl shadow-black/50 md:left-auto md:right-0"
                      role="menu"
                    >
                      <button
                        onClick={handleCopyShareLink}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-body text-cinema-text transition-colors hover:bg-cinema-hover"
                        role="menuitem"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-cinema-muted" />
                        )}
                        {copied ? "Copied" : "Copy link"}
                      </button>
                      <div className="h-px bg-cinema-border" />
                      {shareLinks.map(({ label, href, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-body text-cinema-text transition-colors hover:bg-cinema-hover"
                          role="menuitem"
                        >
                          <Icon className="h-4 w-4 text-cinema-muted" />
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
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
                    <CastAvatar member={member} />
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
