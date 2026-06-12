import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hero } from "../components/ui/Hero";
import { CategoryRow } from "../components/ui/CategoryRow";
import { CollectionGrid } from "../components/ui/CollectionGrid";
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getHorrorMovies,
  getTrendingTV,
  getAiringTodayTV,
  getActionMovies,
  getAnimationMovies,
  getKoreanSeries,
} from "../services/tmdb";
import type { Movie, TVSeries } from "../types";
import { useWatchlist } from "../hooks/useWatchlist";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { collections } from "../data/collections";

interface HomePageData {
  trending: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
  horror: Movie[];
  action: Movie[];
  animation: Movie[];
  trendingTV: TVSeries[];
  airingToday: TVSeries[];
  korean: TVSeries[];
}

const HOME_CACHE_TTL = 1000 * 60 * 10;
let homeCache: { data: HomePageData; updatedAt: number } | null = null;

function isHomeCacheFresh() {
  return homeCache ? Date.now() - homeCache.updatedAt < HOME_CACHE_TTL : false;
}

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>(
    () => homeCache?.data.trending ?? [],
  );
  const [nowPlaying, setNowPlaying] = useState<Movie[]>(
    () => homeCache?.data.nowPlaying ?? [],
  );
  const [upcoming, setUpcoming] = useState<Movie[]>(
    () => homeCache?.data.upcoming ?? [],
  );
  const [horror, setHorror] = useState<Movie[]>(
    () => homeCache?.data.horror ?? [],
  );
  const [action, setAction] = useState<Movie[]>(
    () => homeCache?.data.action ?? [],
  );
  const [animation, setAnimation] = useState<Movie[]>(
    () => homeCache?.data.animation ?? [],
  );
  const [trendingTV, setTrendingTV] = useState<TVSeries[]>(
    () => homeCache?.data.trendingTV ?? [],
  );
  const [airingToday, setAiringToday] = useState<TVSeries[]>(
    () => homeCache?.data.airingToday ?? [],
  );
  const [korean, setKorean] = useState<TVSeries[]>(
    () => homeCache?.data.korean ?? [],
  );
  const [loading, setLoading] = useState(() => !homeCache);

  const { watchlist } = useWatchlist();

  useEffect(() => {
    if (isHomeCacheFresh()) return;

    let isActive = true;
    const fetchAll = async () => {
      if (!homeCache) setLoading(true);

      try {
        const [t, np, up, hor, act, anim, ttv, at, kr] = await Promise.all([
          getTrendingMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies(),
          getHorrorMovies(),
          getActionMovies(),
          getAnimationMovies(),
          getTrendingTV(),
          getAiringTodayTV(),
          getKoreanSeries(),
        ]);
        const data = {
          trending: t.data.results,
          nowPlaying: np.data.results,
          upcoming: up.data.results,
          horror: hor.data.results,
          action: act.data.results,
          animation: anim.data.results,
          trendingTV: ttv.data.results,
          airingToday: at.data.results,
          korean: kr.data.results,
        };

        homeCache = { data, updatedAt: Date.now() };

        if (!isActive) return;
        setTrending(data.trending);
        setNowPlaying(data.nowPlaying);
        setUpcoming(data.upcoming);
        setHorror(data.horror);
        setAction(data.action);
        setAnimation(data.animation);
        setTrendingTV(data.trendingTV);
        setAiringToday(data.airingToday);
        setKorean(data.korean);
      } catch (err) {
        console.error(err);
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchAll();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Watch Free Movies & TV Series Online"
        description="Watch free movies and TV series online on FreeKyi. Explore MM sub movies, Myanmar subtitles, trending films, Korean dramas, anime, action, horror, and popular shows."
        path="/"
        keywords={[
          "free movies",
          "watch movies online",
          "free TV series",
          "stream movies free",
          "mm sub",
          "Myanmar subtitles",
          "Burmese subtitles",
          "free mm movies",
          "Korean dramas",
          "new movies online",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: seoConfig.siteName,
            alternateName: seoConfig.alternateSiteName,
            url: seoConfig.siteUrl,
            description:
              "Watch free movies and TV series online, including MM sub movies, Myanmar subtitles, trending films, Korean dramas, anime, and popular TV shows.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: seoConfig.siteName,
            alternateName: seoConfig.alternateSiteName,
            url: seoConfig.siteUrl,
            logo: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
          },
        ]}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-screen-2xl"
      >
        <Hero movies={trending} loading={loading} />

        <div className="mt-8 space-y-12">
          {watchlist.length > 0 && (
            <CategoryRow
              title="Continue Watching"
              items={watchlist}
              type="movie" // CategoryRow handles mixed types based on item.media_type automatically if passed correctly
              viewAllLink="/watchlist"
              loading={loading}
            />
          )}
          <CategoryRow
            title="Now Playing"
            items={nowPlaying}
            type="movie"
            viewAllLink="/movies?sort=now_playing"
            loading={loading}
          />
          <CategoryRow
            title="New Releases"
            items={upcoming}
            type="movie"
            viewAllLink="/movies?sort=upcoming"
            loading={loading}
          />
          <CollectionGrid collections={collections} />
          <CategoryRow
            title="Trending TV Series"
            items={trendingTV}
            type="tv"
            viewAllLink="/tv"
            loading={loading}
          />
          <CategoryRow
            title="Korean Dramas"
            items={korean}
            type="tv"
            viewAllLink="/tv?country=KR"
            loading={loading}
          />
          <CategoryRow
            title="Action"
            items={action}
            type="movie"
            viewAllLink="/movies?genre=28"
            loading={loading}
          />
          <CategoryRow
            title="Horror"
            items={horror}
            type="movie"
            viewAllLink="/movies?genre=27"
            loading={loading}
          />
          <CategoryRow
            title="Animation"
            items={animation}
            type="movie"
            viewAllLink="/movies?genre=16"
            loading={loading}
          />

          <CategoryRow
            title="Airing Today"
            items={airingToday}
            type="tv"
            viewAllLink="/tv?sort=airing_today"
            loading={loading}
          />
        </div>
      </motion.div>
    </>
  );
}
