import axios from "axios";
import { getVideoServers } from "./videoServers";
import type {
  Movie,
  TVSeries,
  MovieDetail,
  TVDetail,
  TMDBResponse,
  CreditsResponse,
  Genre,
  PersonCombinedCreditsResponse,
  PersonDetail,
  SeasonDetail,
} from "../types";

const API_KEY = import.meta.env.VITE_MOVIE_APIKEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const IMAGE_BASE = "https://image.tmdb.org/t/p";
export const POSTER_SM = `${IMAGE_BASE}/w342`;
export const POSTER_MD = `${IMAGE_BASE}/w500`;
export const POSTER_LG = `${IMAGE_BASE}/w780`;
export const BACKDROP_MD = `${IMAGE_BASE}/w1280`;
export const BACKDROP_LG = `${IMAGE_BASE}/original`;

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US" },
});

// Movies
export const getTrendingMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/trending/movie/week", { params: { page } });

export const getPopularMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/movie/popular", { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/movie/top_rated", { params: { page } });

export const getNowPlayingMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/movie/now_playing", { params: { page } });

export const getUpcomingMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/movie/upcoming", { params: { page } });

export const getMovieDetails = (id: number) =>
  api.get<MovieDetail>(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
  api.get<CreditsResponse>(`/movie/${id}/credits`);

export const getSimilarMovies = (id: number) =>
  api.get<TMDBResponse<Movie>>(`/movie/${id}/similar`);

export const getMovieRecommendations = (id: number) =>
  api.get<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);

// TV Series
export const getTrendingTV = (page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/trending/tv/week", { params: { page } });

export const getPopularTV = (page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/tv/popular", { params: { page } });

export const getTopRatedTV = (page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/tv/top_rated", { params: { page } });

export const getAiringTodayTV = (page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/tv/airing_today", { params: { page } });

export const getTVDetails = (id: number) => api.get<TVDetail>(`/tv/${id}`);

export const getTVSeasonDetails = (id: number, seasonNumber: number) =>
  api.get<SeasonDetail>(`/tv/${id}/season/${seasonNumber}`);

export const getTVCredits = (id: number) =>
  api.get<CreditsResponse>(`/tv/${id}/credits`);

export const getSimilarTV = (id: number) =>
  api.get<TMDBResponse<TVSeries>>(`/tv/${id}/similar`);

export const getTVRecommendations = (id: number) =>
  api.get<TMDBResponse<TVSeries>>(`/tv/${id}/recommendations`);

// Genres
export const getMovieGenres = () =>
  api.get<{ genres: Genre[] }>("/genre/movie/list");

export const getTVGenres = () => api.get<{ genres: Genre[] }>("/genre/tv/list");

// Discovery
export const discoverMovies = (params: {
  page?: number;
  with_genres?: string;
  primary_release_year?: number;
  "vote_average.gte"?: number;
  sort_by?: string;
  with_origin_country?: string;
  with_companies?: string;
}) => api.get<TMDBResponse<Movie>>("/discover/movie", { params });

export const discoverTV = (params: {
  page?: number;
  with_genres?: string;
  first_air_date_year?: number;
  "vote_average.gte"?: number;
  sort_by?: string;
  with_origin_country?: string;
  with_original_language?: string;
}) => api.get<TMDBResponse<TVSeries>>("/discover/tv", { params });

// Search
export const searchMulti = (query: string, page = 1) =>
  api.get<TMDBResponse<Movie & TVSeries>>("/search/multi", {
    params: { query, page },
  });

export const searchMovies = (query: string, page = 1) =>
  api.get<TMDBResponse<Movie>>("/search/movie", { params: { query, page } });

export const searchTV = (query: string, page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/search/tv", { params: { query, page } });

// People
export const getPersonDetails = (id: number) =>
  api.get<PersonDetail>(`/person/${id}`);

export const getPersonCombinedCredits = (id: number) =>
  api.get<PersonCombinedCreditsResponse>(`/person/${id}/combined_credits`);

// Genres (Horror = 27, Thriller = 53, Action = 28, etc.)
export const getHorrorMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/discover/movie", {
    params: { page, with_genres: "27", sort_by: "popularity.desc" },
  });

export const getActionMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/discover/movie", {
    params: { page, with_genres: "28", sort_by: "popularity.desc" },
  });

export const getAnimationMovies = (page = 1) =>
  api.get<TMDBResponse<Movie>>("/discover/movie", {
    params: { page, with_genres: "16", sort_by: "popularity.desc" },
  });

export const getKoreanSeries = (page = 1) =>
  api.get<TMDBResponse<TVSeries>>("/discover/tv", {
    params: { page, with_origin_country: "KR", sort_by: "popularity.desc" },
  });

export const getEmbedUrl = (
  id: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number,
) => {
  return (
    getVideoServers({ id, type, season, episode })[0]?.embedUrl ??
    "about:blank"
  );
};
