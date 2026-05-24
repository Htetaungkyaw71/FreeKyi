import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hero } from "../components/ui/Hero";
import { CategoryRow } from "../components/ui/CategoryRow";
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

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [horror, setHorror] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [animation, setAnimation] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVSeries[]>([]);
  const [airingToday, setAiringToday] = useState<TVSeries[]>([]);
  const [korean, setKorean] = useState<TVSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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
        setTrending(t.data.results);
        setNowPlaying(np.data.results);
        setUpcoming(up.data.results);
        setHorror(hor.data.results);
        setAction(act.data.results);
        setAnimation(anim.data.results);
        setTrendingTV(ttv.data.results);
        setAiringToday(at.data.results);
        setKorean(kr.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Hero movies={trending} loading={loading} />

      <div className="mt-8 space-y-10">
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
  );
}
