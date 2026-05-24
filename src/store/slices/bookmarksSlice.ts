import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Movie, TVSeries } from "../../types";

type BookmarkItem = (Movie | TVSeries) & { media_type: "movie" | "tv" };

interface BookmarksState {
  items: BookmarkItem[];
}

const loadBookmarks = (): BookmarkItem[] => {
  try {
    const stored = localStorage.getItem("freekyi_bookmarks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: BookmarksState = {
  items: loadBookmarks(),
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<BookmarkItem>) => {
      const idx = state.items.findIndex(
        (b) =>
          b.id === action.payload.id &&
          b.media_type === action.payload.media_type,
      );
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("freekyi_bookmarks", JSON.stringify(state.items));
    },
    removeBookmark: (
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
      localStorage.setItem("freekyi_bookmarks", JSON.stringify(state.items));
    },
  },
});

export const { toggleBookmark, removeBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
