import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  activeTab: 'all' | 'movie' | 'tv';
}

const initialState: SearchState = {
  query: '',
  activeTab: 'all',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'all' | 'movie' | 'tv'>) => {
      state.activeTab = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.activeTab = 'all';
    },
  },
});

export const { setQuery, setActiveTab, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
