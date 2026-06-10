import { Link } from "react-router-dom";
import {
  ArrowRight,
  Captions,
  Clapperboard,
  Film,
  Search,
  Tv,
} from "lucide-react";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { collections } from "../data/collections";

const pagePath = "/myanmar-subtitles";
const pageTitle = "MM Sub Movies and Myanmar Subtitles";
const pageDescription =
  "Find MM sub movies, Myanmar subtitles, Burmese subtitles, free MM movies, TV series, Korean drama, anime, and trending titles on FreeKyi.";

const faqs = [
  {
    question: "What does MM sub mean?",
    answer:
      "MM sub usually means Myanmar subtitles or Burmese subtitles for movies, TV series, anime, and drama titles.",
  },
  {
    question: "Can I find free MM movies on FreeKyi?",
    answer:
      "FreeKyi helps viewers browse and search movies, TV series, Korean drama, anime, and trending titles commonly searched as MM movies or free MM movies.",
  },
  {
    question: "Can I search by movie name with Myanmar subtitles?",
    answer:
      "Yes. Use FreeKyi search to look up a movie or TV series name, then open the detail page for cast, overview, ratings, recommendations, and watch options.",
  },
  {
    question: "Are Myanmar subtitles and Burmese subtitles the same search intent?",
    answer:
      "Many viewers use Myanmar subtitles, Burmese subtitles, MM subtitles, and MM sub to search for the same kind of subtitle-friendly movie and TV experience.",
  },
];

const quickLinks = [
  {
    title: "MM Movies",
    description: "Browse popular movies, new releases, and genre collections.",
    to: "/movies",
    icon: Film,
  },
  {
    title: "MM TV Series",
    description: "Find TV shows, Korean drama, anime, and trending series.",
    to: "/tv",
    icon: Tv,
  },
  {
    title: "Search MM Sub",
    description: "Search directly by movie name, series name, or keyword.",
    to: "/search",
    icon: Search,
  },
];

export default function MyanmarSubtitles() {
  return (
    <>
      <SEO
        title="MM Sub Movies & Myanmar Subtitles"
        description={pageDescription}
        path={pagePath}
        keywords={[
          "mm sub",
          "mm subtitles",
          "Myanmar subtitles",
          "Burmese subtitles",
          "mm movies",
          "free mm movies",
          "Myanmar subtitle movies",
          "Burmese subtitle movies",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            url: `${seoConfig.siteUrl}${pagePath}`,
            isPartOf: {
              "@type": "WebSite",
              name: seoConfig.siteName,
              alternateName: seoConfig.alternateSiteName,
              url: seoConfig.siteUrl,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />

      <div className="min-h-screen bg-cinema-bg">
        <section className="relative min-h-[68vh] overflow-hidden">
          <img
            src="https://image.tmdb.org/t/p/original/4EAAwpylq313qrDqpCxulUrXBNF.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-cinema-bg/90 to-cinema-bg/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-transparent to-black/20" />

          <div className="relative z-10 flex min-h-[68vh] max-w-screen-2xl flex-col justify-end px-4 pb-12 pt-28 md:px-8 md:pb-16">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest text-cinema-accent">
                <Captions className="h-3.5 w-3.5" />
                Myanmar Subtitle Guide
              </div>
              <h1 className="font-display text-4xl leading-none text-white hero-text-shadow md:text-6xl lg:text-7xl">
                MM Sub Movies and Myanmar Subtitles
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-cinema-text md:text-lg">
                Find movies and TV series searched as MM sub, Myanmar
                subtitles, Burmese subtitles, MM movies, and free MM movies.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 rounded-full bg-cinema-accent px-5 py-3 text-sm font-body font-semibold text-white transition hover:bg-cinema-accent/90"
                >
                  Browse MM Movies
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 rounded-full border border-cinema-border bg-cinema-hover px-5 py-3 text-sm font-body font-semibold text-white transition hover:border-cinema-accent"
                >
                  Search Titles
                  <Search className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-screen-2xl">
            <div className="grid gap-4 md:grid-cols-3">
              {quickLinks.map(({ description, icon: Icon, title, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-lg border border-cinema-border bg-cinema-card p-5 transition hover:-translate-y-0.5 hover:border-cinema-accent/70"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-cinema-hover text-cinema-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-2xl text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-cinema-muted">
                    {description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-body font-semibold text-cinema-accent">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-4 md:px-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-body font-bold uppercase tracking-widest text-cinema-accent">
                <Clapperboard className="h-3.5 w-3.5" />
                Popular MM paths
              </div>
              <h2 className="font-display text-3xl text-white">
                Browse by Mood
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cinema-muted">
                Start with a popular movie or series category, then open a
                title page for overview, rating, cast, and related picks.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  to={`/collections/${collection.slug}`}
                  className="group relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-cinema-card"
                >
                  <img
                    src={collection.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${collection.accent} opacity-80`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-4">
                    <span className="mb-2 w-fit rounded bg-black/45 px-2 py-1 text-[10px] font-body font-bold uppercase tracking-widest text-white/75">
                      {collection.eyebrow}
                    </span>
                    <h3 className="font-display text-2xl leading-none text-white">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl text-white">
              Myanmar Subtitle Questions
            </h2>
            <div className="mt-5 divide-y divide-cinema-border rounded-lg border border-cinema-border bg-cinema-card">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-5">
                  <h3 className="font-body text-base font-semibold text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cinema-muted">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
