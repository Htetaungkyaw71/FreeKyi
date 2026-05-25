import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500); // TMDB caps at 500
  const delta = 2;
  const mobileDelta = 1;

  const getPageNumbers = (pageDelta = delta) => {
    const pages: (number | '...')[] = [];
    const left = Math.max(2, currentPage - pageDelta);
    const right = Math.min(maxPages - 1, currentPage + pageDelta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < maxPages - 1) pages.push('...');
    if (maxPages > 1) pages.push(maxPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-5 md:mt-8 pb-1 md:pb-0">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-cinema-card border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex md:hidden items-center justify-center gap-1 min-w-0">
        {getPageNumbers(mobileDelta).map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-8 h-9 px-2 flex items-center justify-center rounded-lg text-sm font-mono transition-all border ${
              page === currentPage
                ? 'bg-cinema-accent text-white border-cinema-accent shadow-lg shadow-cinema-accent/30'
                : page === '...'
                ? 'text-cinema-muted border-transparent cursor-default px-0 min-w-4'
                : 'bg-cinema-card border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="hidden md:flex items-center justify-center gap-1">
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
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-cinema-card border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
