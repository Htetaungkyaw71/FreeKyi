import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { MediaCard } from "../cards/MediaCard";
import { CardSkeleton } from "../skeletons";
import type { Movie, TVSeries } from "../../types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

interface CategoryRowProps {
  title: string;
  items: (Movie | TVSeries)[];
  type: "movie" | "tv";
  viewAllLink?: string;
  loading?: boolean;
}

export function CategoryRow({
  title,
  items,
  type,
  viewAllLink,
  loading,
}: CategoryRowProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="font-display text-2xl md:text-3xl text-cinema-text tracking-wide">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 text-sm text-cinema-muted hover:text-cinema-accent transition-colors font-body"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex gap-3 px-4 md:px-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode
          navigation
          className="!px-4 md:!px-8"
        >
          {items.slice(0, 16).map((item, idx) => (
            <SwiperSlide
              key={item.id}
              style={{ width: "auto" }}
              className="!w-[140px] sm:!w-[160px] md:!w-[180px]"
            >
              <MediaCard item={item} type={type} index={idx} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
