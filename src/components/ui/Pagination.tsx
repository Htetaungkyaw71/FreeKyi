import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500); // TMDB caps at 500
  const delta = 2;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(maxPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < maxPages - 1) pages.push('...');
    if (maxPages > 1) pages.push(maxPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-cinema-card border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-mono transition-all border ${
            page === currentPage
              ? 'bg-cinema-accent text-white border-cinema-accent shadow-lg shadow-cinema-accent/30'
              : page === '...'
              ? 'text-cinema-muted border-transparent cursor-default'
              : 'bg-cinema-card border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-cinema-card border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
