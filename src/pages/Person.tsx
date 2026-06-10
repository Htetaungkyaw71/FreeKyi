import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { MediaCard } from "../components/cards/MediaCard";
import { GridSkeleton } from "../components/skeletons";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import {
  IMAGE_BASE,
  getPersonCombinedCredits,
  getPersonDetails,
} from "../services/tmdb";
import type { PersonCredit, PersonDetail } from "../types";
import { parseMediaId, slugifyTitle } from "../utils/mediaUrls";

interface PersonPageData {
  person: PersonDetail;
  credits: PersonCredit[];
}

const PERSON_CACHE_TTL = 1000 * 60 * 10;
const personCache = new Map<
  string,
  { data: PersonPageData; updatedAt: number }
>();

function getFreshPersonCache(id: number) {
  const cached = personCache.get(String(id));
  if (!cached || Date.now() - cached.updatedAt >= PERSON_CACHE_TTL) return null;
  return cached.data;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCreditDate(item: PersonCredit) {
  return item.release_date || item.first_air_date || "";
}

function normalizeCredits(credits: PersonCredit[]) {
  const seen = new Set<string>();

  return credits
    .filter((item) => {
      if (!item.id || !["movie", "tv"].includes(item.media_type)) return false;
      if (!item.poster_path && !item.backdrop_path) return false;
      const key = `${item.media_type}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const dateA = getCreditDate(a);
      const dateB = getCreditDate(b);
      if (dateA && dateB && dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
}

export default function Person() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const personId = parseMediaId(id);
  const initialData = personId ? getFreshPersonCache(personId) : null;

  const [person, setPerson] = useState<PersonDetail | null>(
    () => initialData?.person ?? null,
  );
  const [credits, setCredits] = useState<PersonCredit[]>(
    () => initialData?.credits ?? [],
  );
  const [loading, setLoading] = useState(() => !initialData);
  const [imageFailed, setImageFailed] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    if (!personId) return;

    const cached = getFreshPersonCache(personId);
    if (cached) {
      setPerson(cached.person);
      setCredits(cached.credits);
      setLoading(false);
      return;
    }

    let isActive = true;
    setPerson(null);
    setCredits([]);
    setImageFailed(false);
    setBioExpanded(false);
    setLoading(true);

    const fetchPerson = async () => {
      try {
        const [personResponse, creditsResponse] = await Promise.all([
          getPersonDetails(personId),
          getPersonCombinedCredits(personId),
        ]);
        const data = {
          person: personResponse.data,
          credits: normalizeCredits(creditsResponse.data.cast),
        };

        personCache.set(String(personId), {
          data,
          updatedAt: Date.now(),
        });

        if (!isActive) return;
        setPerson(data.person);
        setCredits(data.credits);
      } catch (error) {
        if (isActive) console.error(error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchPerson();

    return () => {
      isActive = false;
    };
  }, [personId]);

  const knownFor = useMemo(() => credits.slice(0, 60), [credits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cinema-bg px-4 pt-24 md:px-8">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-8 grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="skeleton max-md:hidden aspect-[2/3] rounded-lg" />
            <div className="space-y-4">
              <div className="skeleton h-10 w-64 rounded" />
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-4/6 rounded" />
            </div>
          </div>
          <GridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cinema-bg px-4 text-center">
        <User className="h-12 w-12 text-cinema-muted" />
        <h1 className="mt-4 font-display text-3xl text-white">
          Cast Not Found
        </h1>
        <Link
          to="/"
          className="mt-5 rounded-lg bg-cinema-accent px-4 py-2 text-sm font-body font-semibold text-white"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const profileUrl =
    person.profile_path && !imageFailed
      ? `${IMAGE_BASE}/w500${person.profile_path}`
      : null;
  const canonicalPath = `/person/${person.id}-${slugifyTitle(person.name)}`;
  const birthday = formatDate(person.birthday);
  const deathday = formatDate(person.deathday);
  const biography = person.biography.trim();
  const shouldCollapseBio = biography.length > 520;
  const visibleBiography =
    shouldCollapseBio && !bioExpanded
      ? `${biography.slice(0, 520).trim()}...`
      : biography;
  const seoDescription = person.biography
    ? person.biography.replace(/\s+/g, " ").slice(0, 220)
    : `Explore ${person.name} movies and TV series on FreeKyi, including cast details, biography, and known-for titles.`;

  return (
    <>
      <SEO
        title={`${person.name} Movies and TV Shows`}
        description={seoDescription}
        path={canonicalPath}
        image={profileUrl}
        imageAlt={person.name}
        keywords={[
          person.name,
          `${person.name} movies`,
          `${person.name} TV shows`,
          `${person.name} cast`,
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.name,
          description: seoDescription,
          image: profileUrl || undefined,
          url: `${seoConfig.siteUrl}${canonicalPath}`,
          birthDate: person.birthday || undefined,
          deathDate: person.deathday || undefined,
          birthPlace: person.place_of_birth || undefined,
          jobTitle: person.known_for_department || undefined,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-cinema-bg pb-16 pt-20"
      >
        <section className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-body text-cinema-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
            <div className="overflow-hidden rounded-lg border border-cinema-border bg-cinema-card shadow-2xl shadow-black/30 md:self-start">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="aspect-[2/3] w-full object-cover max-md:hidden"
                  decoding="async"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-cinema-hover text-cinema-muted">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col justify-start">
              <p className="mb-2 text-xs font-body font-bold uppercase tracking-widest text-cinema-accent">
                {person.known_for_department || "Cast"}
              </p>
              <h1 className="font-display text-4xl leading-none text-white md:text-6xl">
                {person.name}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2 text-sm font-body text-cinema-muted">
                {birthday && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cinema-border bg-cinema-card px-3 py-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {deathday ? `${birthday} - ${deathday}` : birthday}
                  </span>
                )}
                {person.place_of_birth && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cinema-border bg-cinema-card px-3 py-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {person.place_of_birth}
                  </span>
                )}
              </div>

              {biography && (
                <div className="mt-5 max-w-4xl">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-cinema-text md:text-base">
                    {visibleBiography}
                  </p>
                  {shouldCollapseBio && (
                    <button
                      type="button"
                      onClick={() => setBioExpanded((value) => !value)}
                      className="mt-3 text-sm font-body font-semibold text-cinema-accent transition-colors hover:text-white"
                    >
                      {bioExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-screen-2xl px-4 md:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-white">
                Movies & TV Shows
              </h2>
              <p className="mt-1 text-sm text-cinema-muted">
                Showing {knownFor.length.toLocaleString()} titles featuring{" "}
                {person.name}
              </p>
            </div>
          </div>

          {knownFor.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-4">
              {knownFor.map((item, index) => (
                <MediaCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  type={item.media_type}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-cinema-border bg-cinema-card py-14 text-center text-cinema-muted">
              No movies or TV shows found.
            </div>
          )}
        </section>
      </motion.div>
    </>
  );
}
