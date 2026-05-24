import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FilterState } from "../../types";

interface FiltersStateAll {
  movie: FilterState;
  tv: FilterState;
}

const defaultFilter: FilterState = {
  genre: null,
  year: null,
  rating: null,
  country: null,
  sortBy: "popularity.desc",
};

const initialState: FiltersStateAll = {
  movie: { ...defaultFilter },
  tv: { ...defaultFilter },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setMovieFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.movie = { ...state.movie, ...action.payload };
    },
    setTVFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.tv = { ...state.tv, ...action.payload };
    },
    resetMovieFilters: (state) => {
      state.movie = { ...defaultFilter };
    },
    resetTVFilters: (state) => {
      state.tv = { ...defaultFilter };
    },
  },
});

export const {
  setMovieFilter,
  setTVFilter,
  resetMovieFilters,
  resetTVFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
