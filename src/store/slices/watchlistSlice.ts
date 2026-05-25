import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Movie, TVSeries } from "../../types";

type WatchlistItem = (Movie | TVSeries) & { media_type: "movie" | "tv" };

interface WatchlistState {
  items: WatchlistItem[];
}

const loadWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem("freekyi_watchlist");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: WatchlistState = {
  items: loadWatchlist(),
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      const idx = state.items.findIndex(
        (b) =>
          b.id === action.payload.id &&
          b.media_type === action.payload.media_type,
      );
      // If it exists, remove it so we can put it at the beginning
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else if (state.items.length >= 300) {
        // Enforce limit only if it's a new addition
        state.items.pop(); // Optionally just remove the oldest rather than alerting for passive tracking
      }

      state.items.unshift(action.payload);
      try {
        localStorage.setItem("freekyi_watchlist", JSON.stringify(state.items));
      } catch {
        // ignore
      }
    },
    toggleWatchlist: (state, action: PayloadAction<WatchlistItem>) => {
      const idx = state.items.findIndex(
        (b) =>
          b.id === action.payload.id &&
          b.media_type === action.payload.media_type,
      );
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        if (state.items.length >= 300) {
          alert("Watchlist limit reached. You can only store up to 300 items.");
          return;
        }
        // Add new watchlist item to the beginning of the list
        state.items.unshift(action.payload);
      }
      try {
        localStorage.setItem("freekyi_watchlist", JSON.stringify(state.items));
      } catch (e) {
        console.error("Failed to save watchlist to localStorage:", e);
      }
    },
    removeWatchlist: (
      state,
      action: PayloadAction<{ id: number; media_type: "movie" | "tv" }>,
    ) => {
      state.items = state.items.filter(
        (b) =>
          !(
            b.id === action.payload.id &&
            b.media_type === action.payload.media_type
          ),
      );
      try {
        localStorage.setItem("freekyi_watchlist", JSON.stringify(state.items));
      } catch {
        // ignore
      }
    },
  },
});

export const { addToWatchlist, toggleWatchlist, removeWatchlist } =
  watchlistSlice.actions;
export default watchlistSlice.reducer;
