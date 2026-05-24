export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
  media_type?: "movie" | "tv";
}

export interface TVSeries {
  id: number;
  name: string;
  title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  release_date?: string;
  genre_ids: number[];
  popularity: number;
  media_type?: "tv";
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  spoken_languages: { english_name: string; name: string }[];
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
}

export interface TVDetail extends Omit<TVSeries, "genre_ids"> {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  networks: { id: number; name: string; logo_path: string | null }[];
  seasons: Season[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  spoken_languages: { english_name: string; name: string }[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: { id: number; name: string; job: string; department: string }[];
}

export type MediaType = "movie" | "tv";

export interface FilterState {
  genre: number | null;
  year: number | null;
  rating: number | null;
  country: string | null;
  sortBy: string;
}
