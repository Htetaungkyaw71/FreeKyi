import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  currentId: number | null;
  currentType: 'movie' | 'tv' | null;
  season: number;
  episode: number;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentId: null,
  currentType: null,
  season: 1,
  episode: 1,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<{ id: number; type: 'movie' | 'tv' }>) => {
      state.currentId = action.payload.id;
      state.currentType = action.payload.type;
      state.season = 1;
      state.episode = 1;
    },
    setSeason: (state, action: PayloadAction<number>) => {
      state.season = action.payload;
      state.episode = 1;
    },
    setEpisode: (state, action: PayloadAction<number>) => {
      state.episode = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    clearPlayer: (state) => {
      state.currentId = null;
      state.currentType = null;
      state.season = 1;
      state.episode = 1;
      state.isPlaying = false;
    },
  },
});

export const { setMedia, setSeason, setEpisode, setIsPlaying, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
