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
        if (state.items.length >= 300) {
          alert("Bookmark limit reached. You can only store up to 300 items.");
          return;
        }
        // Add new bookmark to the beginning of the list
        state.items.unshift(action.payload);
      }
      try {
        localStorage.setItem("freekyi_bookmarks", JSON.stringify(state.items));
      } catch (e) {
        console.error("Failed to save bookmarks to localStorage:", e);
      }
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
