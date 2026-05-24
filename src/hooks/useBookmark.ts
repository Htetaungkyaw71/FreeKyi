import { useAppSelector, useAppDispatch } from './useStore';
import { toggleBookmark } from '../store/slices/bookmarksSlice';
import type { Movie, TVSeries } from '../types';

export function useBookmark() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.bookmarks.items);

  const isBookmarked = (id: number, type: 'movie' | 'tv') =>
    items.some((b) => b.id === id && b.media_type === type);

  const toggle = (item: (Movie | TVSeries) & { media_type: 'movie' | 'tv' }) => {
    dispatch(toggleBookmark(item));
  };

  return { isBookmarked, toggle, bookmarks: items };
}
