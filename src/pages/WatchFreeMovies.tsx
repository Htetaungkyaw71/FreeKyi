import { Link } from "react-router-dom";
import { ArrowRight, Clapperboard, Film, Search, Sparkles, Tv } from "lucide-react";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { collections } from "../data/collections";
import { contactEmail, sameAsLinks } from "../data/socialLinks";

const pagePath = "/watch-free-movies-online";
const pageTitle = "Where to Watch Movies and TV Series Online";
const pageDescription =
  "FreeKyi helps you discover movies and TV series online by title, genre, year, rating, collections, and trending categories.";

const faqs = [
  {
    question: "Where can I watch movies online?",
    answer:
      "FreeKyi is a movie and TV discovery site where viewers can browse films, series, new releases, trending titles, and curated collections in one place.",
  },
  {
    question: "Can I find TV series and Korean drama on FreeKyi?",
    answer:
      "Yes. FreeKyi includes TV series, Korean drama, anime series, airing-today shows, and popular series collections for quick discovery.",
  },
  {
    question: "Can I search by movie name or series name?",
    answer:
      "Yes. Use FreeKyi search to find movies and TV series by title, then open the detail page for rating, release year, cast, overview, recommendations, and watch options.",
  },
  {
    question: "What kinds of movies are organized on FreeKyi?",
    answer:
      "FreeKyi organizes movies by trending titles, new releases, action, horror, animation, romance, comedy, Marvel, and other curated collections.",
  },
];

const quickLinks = [
  {
    title: "Movies",
    description: "Browse popular, new, upcoming, and genre-based movies.",
    to: "/movies",
    icon: Film,
  },
  {
    title: "TV Series",
    description: "Find trending shows, Korean drama, anime, and airing series.",
    to: "/tv",
    icon: Tv,
  },
  {
    title: "Search",
    description: "Search directly by movie name, series name, or keyword.",
    to: "/search",
    icon: Search,
  },
];

export default function WatchFreeMovies() {
  return (
    <>
      <SEO
        title="Where to Watch Movies Online Free"
        description={pageDescription}
        path={pagePath}
        keywords={[
          "where to watch movies online",
          "watch movies online free",
          "free movies online",
          "watch TV series online",
          "Korean drama online",
          "anime series online",
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
            "@type": "WebSite",
            name: seoConfig.siteName,
            alternateName: seoConfig.alternateSiteName,
            url: seoConfig.siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: seoConfig.siteName,
            alternateName: seoConfig.alternateSiteName,
            url: seoConfig.siteUrl,
            logo: `${seoConfig.siteUrl}/web-app-manifest-512x512.png`,
            email: contactEmail,
            sameAs: sameAsLinks,
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
        <section className="relative min-h-[76vh] overflow-hidden">
          <img
            src="https://image.tmdb.org/t/p/original/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-cinema-bg/85 to-cinema-bg/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-transparent to-black/20" />

          <div className="relative z-10 flex min-h-[76vh] max-w-screen-2xl flex-col justify-end px-4 pb-14 pt-28 md:px-8 md:pb-20">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest text-cinema-accent">
                <Sparkles className="h-3.5 w-3.5" />
                FreeKyi Guide
              </div>
              <h1 className="font-display text-4xl leading-none text-white hero-text-shadow md:text-6xl lg:text-7xl">
                Where to Watch Movies and TV Series Online
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-cinema-text md:text-lg">
                FreeKyi helps viewers discover movies and TV series by title,
                genre, year, rating, collections, and trending categories.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 rounded-full bg-cinema-accent px-5 py-3 text-sm font-body font-semibold text-white transition hover:bg-cinema-accent/90"
                >
                  Browse Movies
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
                Popular paths
              </div>
              <h2 className="font-display text-3xl text-white">
                Find Something to Watch
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cinema-muted">
                Start with a mood or category, then open any movie or series
                page for details, cast, ratings, and related recommendations.
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
              Questions People Ask
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
