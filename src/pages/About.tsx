import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, Clapperboard, Search, Sparkles, Tv } from "lucide-react";
import { SEO } from "../components/seo/SEO";
import { seoConfig } from "../components/seo/config";
import { contactEmail, sameAsLinks } from "../data/socialLinks";

const features = [
  {
    title: "Movie discovery",
    description:
      "Browse popular movies, new releases, upcoming titles, genres, ratings, and related recommendations.",
    icon: Clapperboard,
  },
  {
    title: "Series browsing",
    description:
      "Find TV series, Korean dramas, anime, airing-today shows, and trending series pages.",
    icon: Tv,
  },
  {
    title: "Fast search",
    description:
      "Search by movie name, series name, or keyword and open a detail page with cast, overview, rating, and watch options.",
    icon: Search,
  },
  {
    title: "Saved picks",
    description:
      "Bookmark titles and continue watching from your browser for a smoother return experience.",
    icon: Bookmark,
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About FreeKyi"
        description="Learn about FreeKyi, a movie and TV series discovery site for browsing films, series, collections, ratings, cast, and recommendations."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About FreeKyi",
          description:
            "FreeKyi is a movie and TV series discovery site for browsing films, series, collections, ratings, cast, and recommendations.",
          url: `${seoConfig.siteUrl}/about`,
          mainEntity: {
            "@type": "Organization",
            name: seoConfig.siteName,
            alternateName: seoConfig.alternateSiteName,
            url: seoConfig.siteUrl,
            logo: `${seoConfig.siteUrl}/web-app-manifest-512x512.png`,
            email: contactEmail,
            sameAs: sameAsLinks,
          },
        }}
      />

      <div className="min-h-screen bg-cinema-bg px-4 py-24 md:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cinema-accent/30 bg-cinema-accent/10 px-3 py-1 text-xs font-body font-semibold uppercase tracking-widest text-cinema-accent">
              <Sparkles className="h-3.5 w-3.5" />
              About FreeKyi
            </div>
            <h1 className="font-display text-4xl leading-none text-white md:text-6xl">
              A Faster Way to Find Movies and TV Series
            </h1>
            <p className="mt-5 text-base leading-relaxed text-cinema-text md:text-lg">
              FreeKyi helps viewers discover movies and TV series through
              search, curated collections, ratings, cast details, trailers,
              recommendations, bookmarks, and continue watching.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ description, icon: Icon, title }) => (
              <div
                key={title}
                className="rounded-lg border border-cinema-border bg-cinema-card p-5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-cinema-hover text-cinema-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-cinema-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-lg border border-cinema-border bg-cinema-card p-6 md:p-8">
              <h2 className="font-display text-3xl text-white">Our Focus</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-cinema-muted md:text-base">
                <p>
                  FreeKyi is built to make choosing what to watch easier. The
                  site groups titles by mood, genre, trend, release timing, and
                  popular collections so viewers can move from browsing to a
                  detail page quickly.
                </p>
                <p>
                  We keep the experience lightweight on mobile, support PWA
                  installation, and use clear title pages so users and search
                  systems can understand what each movie or series page is about.
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-cinema-border bg-cinema-card p-6 md:p-8">
              <h2 className="font-display text-3xl text-white">Need Help?</h2>
              <p className="mt-4 text-sm leading-relaxed text-cinema-muted md:text-base">
                Report broken images, missing titles, playback problems, or
                feedback through the contact page.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cinema-accent px-5 py-3 text-sm font-body font-semibold text-white transition hover:bg-cinema-accent/90"
              >
                Contact FreeKyi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
