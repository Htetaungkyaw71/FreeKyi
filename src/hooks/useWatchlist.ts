import { useAppSelector, useAppDispatch } from "./useStore";
import {
  toggleWatchlist,
  addToWatchlist,
  removeWatchlist,
} from "../store/slices/watchlistSlice";
import type { Movie, TVSeries } from "../types";

export function useWatchlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.watchlist.items);

  const isWatchlisted = (id: number, type: "movie" | "tv") =>
    items.some((b) => b.id === id && b.media_type === type);

  const toggleW = (
    item: (Movie | TVSeries) & { media_type: "movie" | "tv" },
  ) => {
    dispatch(toggleWatchlist(item));
  };

  const addW = (item: (Movie | TVSeries) & { media_type: "movie" | "tv" }) => {
    dispatch(addToWatchlist(item));
  };

  const removeW = (id: number, media_type: "movie" | "tv") => {
    dispatch(removeWatchlist({ id, media_type }));
  };

  return { isWatchlisted, toggleW, addW, removeW, watchlist: items };
}
