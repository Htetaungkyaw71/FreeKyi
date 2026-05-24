import { configureStore } from '@reduxjs/toolkit';
import bookmarksReducer from './slices/bookmarksSlice';
import searchReducer from './slices/searchSlice';
import filtersReducer from './slices/filtersSlice';
import playerReducer from './slices/playerSlice';

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    search: searchReducer,
    filters: filtersReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
