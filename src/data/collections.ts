import type { MediaType } from "../types";

export interface CollectionConfig {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  mediaType: MediaType;
  accent: string;
  image: string;
  params: {
    with_genres?: string;
    with_origin_country?: string;
    with_original_language?: string;
    with_companies?: string;
    primary_release_year?: number;
    first_air_date_year?: number;
    sort_by?: string;
  };
  keywords: string[];
}

export const collections: CollectionConfig[] = [
  {
    slug: "korean-drama",
    title: "Korean Drama",
    eyebrow: "K-Drama",
    description:
      "Romance, revenge, mystery, and trending Korean series in one easy place.",
    mediaType: "tv",
    accent: "from-pink-500/35 to-cinema-accent/45",
    image: "https://image.tmdb.org/t/p/w780/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    params: {
      with_origin_country: "KR",
      sort_by: "popularity.desc",
    },
    keywords: ["Korean drama", "K-drama", "Korean series"],
  },
  {
    slug: "anime-series",
    title: "Anime Series",
    eyebrow: "Anime",
    description:
      "Popular anime shows, action adventures, fantasy worlds, and comfort rewatches.",
    mediaType: "tv",
    accent: "from-sky-500/35 to-violet-500/45",
    image: "https://image.tmdb.org/t/p/w780/A6tMQAo6t6eRFCPhsrShmxZLqFB.jpg",
    params: {
      with_genres: "16",
      with_origin_country: "JP",
      sort_by: "popularity.desc",
    },
    keywords: ["anime series", "Japanese anime", "watch anime"],
  },
  {
    slug: "horror-night",
    title: "Horror Night",
    eyebrow: "Scary Picks",
    description:
      "Dark, tense, and supernatural movies for late-night horror watching.",
    mediaType: "movie",
    accent: "from-red-700/35 to-zinc-950/75",
    image: "https://image.tmdb.org/t/p/w780/xugEpZk9YQ0DIz1aFvH5HGkqpZK.jpg",
    params: {
      with_genres: "27",
      sort_by: "popularity.desc",
    },
    keywords: ["horror movies", "scary movies", "thriller movies"],
  },
  {
    slug: "action-movies",
    title: "Action Movies",
    eyebrow: "Adrenaline",
    description:
      "Explosive fights, chases, heroes, revenge stories, and big-screen action.",
    mediaType: "movie",
    accent: "from-orange-500/35 to-red-700/45",
    image: "https://image.tmdb.org/t/p/w780/4EAAwpylq313qrDqpCxulUrXBNF.jpg",
    params: {
      with_genres: "28",
      sort_by: "popularity.desc",
    },
    keywords: ["action movies", "adventure movies", "watch action"],
  },
  {
    slug: "romantic-movies",
    title: "Romantic Movies",
    eyebrow: "Love Stories",
    description:
      "Feel-good romance, emotional drama, and date-night movie picks.",
    mediaType: "movie",
    accent: "from-rose-400/35 to-fuchsia-600/45",
    image: "https://image.tmdb.org/t/p/w780/mxdiaM2tsx8M6W3zLgiPwAkhQfq.jpg",
    params: {
      with_genres: "10749",
      sort_by: "popularity.desc",
    },
    keywords: ["romantic movies", "romance movies", "love story movies"],
  },
  {
    slug: "marvel-movies",
    title: "Marvel Movies",
    eyebrow: "Superheroes",
    description:
      "Superhero battles, team-ups, origin stories, and Marvel universe favorites.",
    mediaType: "movie",
    accent: "from-red-600/35 to-blue-700/45",
    image: "https://image.tmdb.org/t/p/w780/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    params: {
      with_companies: "420",
      sort_by: "popularity.desc",
    },
    keywords: ["Marvel movies", "superhero movies", "MCU movies"],
  },
  {
    slug: "comedy-movies",
    title: "Comedy Movies",
    eyebrow: "Laugh Picks",
    description: "Funny, feel-good, and easygoing movies for relaxed watching.",
    mediaType: "movie",
    accent: "from-yellow-400/30 to-emerald-500/40",
    image: "https://image.tmdb.org/t/p/w780/gkh6Nt8DtY1XT4gQsyFq9XAVJlJ.jpg",
    params: {
      with_genres: "35",
      sort_by: "popularity.desc",
    },
    keywords: ["comedy movies", "funny movies", "feel-good movies"],
  },
  {
    slug: "new-movies-2026",
    title: "New Movies 2026",
    eyebrow: "Fresh Releases",
    description:
      "Recent and upcoming movies from 2026, sorted by what people are watching.",
    mediaType: "movie",
    accent: "from-cyan-500/35 to-cinema-accent/45",
    image: "https://image.tmdb.org/t/p/w780/6zg7A9ICOthNR2TSXlT51KvXrsA.jpg",
    params: {
      sort_by: "popularity.desc",
      primary_release_year: 2026,
    },
    keywords: ["new movies 2026", "latest movies", "new releases"],
  },
];

export function getCollection(slug?: string) {
  return collections.find((collection) => collection.slug === slug);
}
