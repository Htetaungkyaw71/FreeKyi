import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clapperboard } from "lucide-react";
import { MediaCard } from "../components/cards/MediaCard";
import { Pagination } from "../components/ui/Pagination";
import { GridSkeleton } from "../components/skeletons";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import {
  getCollection,
  type CollectionConfig,
} from "../data/collections";
import { discoverMovies, discoverTV } from "../services/tmdb";
import type { Movie, TVSeries } from "../types";
import { getMediaPath } from "../utils/mediaUrls";

interface CollectionPageData {
  items: (Movie | TVSeries)[];
  totalPages: number;
}

const COLLECTION_CACHE_TTL = 1000 * 60 * 10;
const collectionCache = new Map<
  string,
  { data: CollectionPageData; updatedAt: number }
>();

function getFreshCollectionCache(key: string) {
  const cached = collectionCache.get(key);
  if (!cached || Date.now() - cached.updatedAt >= COLLECTION_CACHE_TTL) {
    return null;
  }
  return cached.data;
}

function buildParams(collection: CollectionConfig, page: number) {
  return {
    page,
    sort_by: collection.params.sort_by ?? "popularity.desc",
    ...collection.params,
  };
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const collection = getCollection(slug);
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const cacheKey = `${slug ?? "unknown"}:${page}`;
  const cachedData = getFreshCollectionCache(cacheKey);

  const [items, setItems] = useState<(Movie | TVSeries)[]>(
    () => cachedData?.items ?? [],
  );
  const [totalPages, setTotalPages] = useState(
    () => cachedData?.totalPages ?? 1,
  );
  const [loading, setLoading] = useState(() => !cachedData);

  useEffect(() => {
    if (!collection) return;

    const freshData = getFreshCollectionCache(cacheKey);
    if (freshData) {
      setItems(freshData.items);
      setTotalPages(freshData.totalPages);
      setLoading(false);
      return;
    }

    let isActive = true;
    setItems([]);
    setTotalPages(1);
    setLoading(true);

    const fetchCollection = async () => {
      try {
        const params = buildParams(collection, page);
        const response =
          collection.mediaType === "movie"
            ? await discoverMovies(params)
            : await discoverTV(params);

        const data = {
          items: response.data.results,
          totalPages: response.data.total_pages,
        };
        collectionCache.set(cacheKey, { data, updatedAt: Date.now() });

        if (!isActive) return;
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchCollection();

    return () => {
      isActive = false;
    };
  }, [cacheKey, collection, page]);

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage === 1) nextParams.delete("page");
    else nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  if (!collection) {
    return (
      <>
        <SEO
          title="Collection Not Found"
          description="This FreeKyi collection could not be found."
          path={`/collections/${slug ?? ""}`}
          noIndex
        />
        <div className="min-h-screen pt-28 px-4 md:px-8 flex flex-col items-center justify-center text-center">
          <Clapperboard className="w-12 h-12 text-cinema-muted mb-4" />
          <h1 className="font-display text-4xl text-white">
            Collection Not Found
          </h1>
          <Link
            to="/"
            className="mt-5 rounded-full bg-cinema-accent px-5 py-3 text-sm font-body font-semibold text-white"
          >
            Back Home
          </Link>
        </div>
      </>
    );
  }

  const collectionPath =
    page > 1
      ? `/collections/${collection.slug}?page=${page}`
      : `/collections/${collection.slug}`;
  const seoDescription = `${collection.description} Browse ${collection.title.toLowerCase()} on FreeKyi and find curated ${collection.mediaType === "movie" ? "movies" : "TV series"} to watch online.`;

  return (
    <>
      <SEO
        title={`Watch ${collection.title} Online`}
        description={seoDescription}
        path={collectionPath}
        image={collection.image}
        keywords={[
          ...collection.keywords,
          `watch ${collection.title.toLowerCase()} online`,
          `free ${collection.mediaType === "movie" ? "movies" : "series"}`,
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Watch ${collection.title} Online`,
          url: `${seoConfig.siteUrl}${collectionPath}`,
          description: seoDescription,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.slice(0, 12).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${seoConfig.siteUrl}${getMediaPath(collection.mediaType, item)}`,
              name: (item as Movie).title || (item as TVSeries).name,
            })),
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-16 md:pt-20"
      >
        <section className="relative overflow-hidden border-b border-cinema-border">
          <img
            src={collection.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${collection.accent}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-black/35" />

          <div className="relative mx-auto max-w-screen-2xl px-4 py-16 md:px-8 md:py-24">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-body text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex rounded bg-black/45 px-2.5 py-1 text-[11px] font-body font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                {collection.eyebrow}
              </span>
              <h1 className="font-display text-5xl leading-none text-white md:text-7xl">
                {collection.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                {collection.description}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8 md:py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-white">
                All {collection.title}
              </h2>
              <p className="mt-1 text-sm text-cinema-muted">
                Page {page} of {totalPages.toLocaleString()}
              </p>
            </div>
            <Link
              to={
                collection.mediaType === "movie"
                  ? "/movies"
                  : "/tv"
              }
              className="hidden rounded-lg border border-cinema-border px-4 py-2 text-sm font-body text-cinema-muted transition-colors hover:border-cinema-accent hover:text-white md:block"
            >
              Browse All
            </Link>
          </div>

          {loading ? (
            <GridSkeleton count={20} />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-cinema-border bg-cinema-card py-16 text-center">
              <Clapperboard className="h-10 w-10 text-cinema-muted" />
              <p className="mt-4 font-display text-2xl text-white">
                No titles found
              </p>
              <p className="mt-1 text-sm text-cinema-muted">
                This collection needs manual curation.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
                {items.map((item, index) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    type={collection.mediaType}
                    index={index}
                  />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </motion.div>
    </>
  );
}
