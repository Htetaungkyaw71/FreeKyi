import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distDir = resolve(rootDir, "dist");
const indexPath = resolve(distDir, "index.html");
const sitemapPath = resolve(rootDir, "public/sitemap.xml");
function normalizeSiteUrl(value) {
  return value
    .replace(/\/$/, "")
    .replace(/^https:\/\/freekyi\.com$/, "https://www.freekyi.com");
}

const siteUrl = normalizeSiteUrl(
  process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.freekyi.com",
);
const sameAsLinks = [
  "https://t.me/+bKYkU_aTmgM4NmFl",
  "https://www.facebook.com/share/1CpaDU1353/?mibextid=wwXIfr",
];
const contactEmail = "freekyimovie@gmail.com";

const collectionSeoPages = [
  {
    slug: "korean-drama",
    title: "Korean Drama",
    description:
      "Romance, revenge, mystery, and trending Korean series in one easy place.",
    image: "https://image.tmdb.org/t/p/w780/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
  },
  {
    slug: "anime-series",
    title: "Anime Series",
    description:
      "Popular anime shows, action adventures, fantasy worlds, and comfort rewatches.",
    image: "https://image.tmdb.org/t/p/w780/A6tMQAo6t6eRFCPhsrShmxZLqFB.jpg",
  },
  {
    slug: "horror-night",
    title: "Horror Night",
    description:
      "Dark, tense, and supernatural movies for late-night horror watching.",
    image: "https://image.tmdb.org/t/p/w780/6fKEw0I2FTD5FLOQ5q7L1tqf876.jpg",
  },
  {
    slug: "action-movies",
    title: "Action Movies",
    description:
      "Explosive fights, chases, heroes, revenge stories, and big-screen action.",
    image: "https://image.tmdb.org/t/p/w780/4EAAwpylq313qrDqpCxulUrXBNF.jpg",
  },
  {
    slug: "romantic-movies",
    title: "Romantic Movies",
    description:
      "Feel-good romance, emotional drama, and date-night movie picks.",
    image: "https://image.tmdb.org/t/p/w780/sra8XnL96OyLHENcglmZJg6HA8z.jpg",
  },
  {
    slug: "marvel-movies",
    title: "Marvel Movies",
    description:
      "Superhero battles, team-ups, origin stories, and Marvel universe favorites.",
    image: "https://image.tmdb.org/t/p/w780/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
  },
  {
    slug: "comedy-movies",
    title: "Comedy Movies",
    description:
      "Funny, feel-good, and easygoing movies for relaxed watching.",
    image: "https://image.tmdb.org/t/p/w780/gkh6Nt8DtY1XT4gQsyFq9XAVJlJ.jpg",
  },
  {
    slug: "new-movies-2026",
    title: "New Movies 2026",
    description:
      "Recent and upcoming movies from 2026, sorted by what people are watching.",
    image: "https://image.tmdb.org/t/p/w780/uIb9Tvae5haF0XcQBaPyufmxbb0.jpg",
  },
];

const watchFreeMoviesFaqs = [
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

const staticSeoPages = [
  {
    pathname: "/watch-free-movies-online",
    title: "Where to Watch Movies Online Free | FreeKyi",
    description:
      "FreeKyi helps you discover movies and TV series online by title, genre, year, rating, collections, and trending categories.",
    image: `${siteUrl}/web-app-manifest-512x512.png`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Where to Watch Movies and TV Series Online",
        description:
          "FreeKyi helps you discover movies and TV series online by title, genre, year, rating, collections, and trending categories.",
        url: `${siteUrl}/watch-free-movies-online`,
        isPartOf: {
          "@type": "WebSite",
          name: "FreeKyi",
          alternateName: "Freekyi",
          url: siteUrl,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "FreeKyi",
        alternateName: "Freekyi",
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FreeKyi",
        alternateName: "Freekyi",
        url: siteUrl,
        logo: `${siteUrl}/web-app-manifest-512x512.png`,
        email: contactEmail,
        sameAs: sameAsLinks,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: watchFreeMoviesFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  },
  {
    pathname: "/about",
    title: "About FreeKyi | FreeKyi",
    description:
      "Learn about FreeKyi, a movie and TV series discovery site for browsing films, series, collections, ratings, cast, and recommendations.",
    image: `${siteUrl}/web-app-manifest-512x512.png`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About FreeKyi",
      description:
        "FreeKyi is a movie and TV series discovery site for browsing films, series, collections, ratings, cast, and recommendations.",
      url: `${siteUrl}/about`,
      mainEntity: {
        "@type": "Organization",
        name: "FreeKyi",
        alternateName: "Freekyi",
        url: siteUrl,
        logo: `${siteUrl}/web-app-manifest-512x512.png`,
        email: contactEmail,
        sameAs: sameAsLinks,
      },
    },
  },
  {
    pathname: "/contact",
    title: "Contact FreeKyi | FreeKyi",
    description:
      "Contact FreeKyi through Telegram, Facebook, or email for support, feedback, broken links, image issues, and removal requests.",
    image: `${siteUrl}/web-app-manifest-512x512.png`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact FreeKyi",
      description:
        "Contact FreeKyi through Telegram, Facebook, or email for support, feedback, broken links, image issues, and removal requests.",
      url: `${siteUrl}/contact`,
      mainEntity: {
        "@type": "Organization",
        name: "FreeKyi",
        alternateName: "Freekyi",
        url: siteUrl,
        logo: `${siteUrl}/web-app-manifest-512x512.png`,
        email: contactEmail,
        contactPoint: {
          "@type": "ContactPoint",
          email: contactEmail,
          contactType: "customer support",
        },
        sameAs: sameAsLinks,
      },
    },
  },
];

function parseEnvFile(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const [key, ...valueParts] = line.split("=");
        const value = valueParts
          .join("=")
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [key.trim(), value];
      }),
  );
}

async function loadEnv() {
  try {
    const env = parseEnvFile(await readFile(resolve(rootDir, ".env"), "utf8"));
    for (const [key, value] of Object.entries(env)) {
      process.env[key] ??= value;
    }
  } catch {
    // Vercel provides environment variables directly.
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value) {
  return String(value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function truncate(value, maxLength) {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

function parseSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) =>
    match[1].replace(/&amp;/g, "&"),
  );
}

function parseDetailUrl(url) {
  try {
    const { pathname } = new URL(url);
    const match = pathname.match(/^\/(movie|tv)\/(\d+)/);
    if (!match) return null;
    return {
      mediaType: match[1],
      id: Number(match[2]),
      pathname,
    };
  } catch {
    return null;
  }
}

function getTitle(detail, mediaType) {
  return mediaType === "movie"
    ? detail.title || detail.original_title || ""
    : detail.name || detail.original_name || "";
}

function getDate(detail, mediaType) {
  return mediaType === "movie" ? detail.release_date : detail.first_air_date;
}

function getImage(detail) {
  const path = detail.poster_path || detail.backdrop_path;
  return path ? `https://image.tmdb.org/t/p/w780${path}` : `${siteUrl}/web-app-manifest-512x512.png`;
}

function buildDescription(detail, mediaType, title) {
  const date = getDate(detail, mediaType);
  const year = date ? new Date(date).getFullYear() : null;
  const overview = truncate(detail.overview, 160);
  const label = mediaType === "movie" ? "movie" : "TV series";

  if (overview) {
    return truncate(
      `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. ${overview}`,
      220,
    );
  }

  return `Watch ${title}${year ? ` (${year})` : ""} online on FreeKyi. Find ${label} details, ratings, cast, and recommendations.`;
}

function buildJsonLd(detail, mediaType, title, description, canonicalUrl, image) {
  return {
    "@context": "https://schema.org",
    "@type": mediaType === "movie" ? "Movie" : "TVSeries",
    name: title,
    description,
    image,
    url: canonicalUrl,
    datePublished: getDate(detail, mediaType) || undefined,
    genre: Array.isArray(detail.genres)
      ? detail.genres.map((genre) => genre.name).filter(Boolean)
      : undefined,
    aggregateRating:
      detail.vote_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(detail.vote_average || 0).toFixed(1),
            bestRating: "10",
            ratingCount: detail.vote_count,
          }
        : undefined,
  };
}

function seoHead({ canonicalUrl, description, image, jsonLd, mediaType, title }) {
  const pageTitle =
    mediaType === "movie"
      ? `Watch ${title} Online Free | FreeKyi`
      : `Watch ${title} TV Series Online Free | FreeKyi`;
  const ogType = mediaType === "movie" ? "video.movie" : "video.tv_show";

  return `    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="FreeKyi" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(`${title} poster`)}" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
}

function collectionSeoHead({ canonicalUrl, description, image, title }) {
  const pageTitle = `Watch ${title} Online | FreeKyi`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description,
    image,
    url: canonicalUrl,
  };

  return `    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeKyi" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(`${title} collection`)}" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
}

function staticSeoHead({ canonicalUrl, description, image, jsonLd, title }) {
  return `    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FreeKyi" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="FreeKyi" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`;
}

function injectSeo(baseHtml, seoMarkup) {
  return baseHtml
    .replace(/    <title>.*?<\/title>\s*/s, seoMarkup)
    .replace(/<html lang="en">/, '<html lang="en" data-prerendered-seo="true">');
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function fetchDetail(baseUrl, apiKey, mediaType, id, attempts = 3) {
  const endpoint = mediaType === "movie" ? `/movie/${id}` : `/tv/${id}`;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    } catch (error) {
      if (attempt === attempts) throw error;
      await wait(250 * attempt);
    }
  }

  return null;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

await loadEnv();

const apiKey = process.env.VITE_MOVIE_APIKEY;
const baseUrl = process.env.VITE_BASE_URL || "https://api.themoviedb.org/3";

if (!apiKey) {
  console.warn("Missing VITE_MOVIE_APIKEY; skipping detail SEO prerender.");
  process.exit(0);
}

const [baseHtml, sitemapXml] = await Promise.all([
  readFile(indexPath, "utf8"),
  readFile(sitemapPath, "utf8"),
]);

const details = parseSitemapUrls(sitemapXml).map(parseDetailUrl).filter(Boolean);

for (const collection of collectionSeoPages) {
  const pathname = `/collections/${collection.slug}`;
  const html = injectSeo(
    baseHtml,
    collectionSeoHead({
      canonicalUrl: `${siteUrl}${pathname}`,
      description: `${collection.description} Browse curated ${collection.title.toLowerCase()} on FreeKyi.`,
      image: collection.image,
      title: collection.title,
    }),
  );
  const outputDir = resolve(distDir, pathname.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "index.html"), html);
}

for (const page of staticSeoPages) {
  const canonicalUrl = `${siteUrl}${page.pathname}`;
  const html = injectSeo(
    baseHtml,
    staticSeoHead({
      canonicalUrl,
      description: page.description,
      image: page.image,
      jsonLd: page.jsonLd,
      title: page.title,
    }),
  );
  const outputDir = resolve(distDir, page.pathname.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(resolve(outputDir, "index.html"), html);
}

await mapWithConcurrency(details, 6, async ({ id, mediaType, pathname }) => {
  try {
    const detail = await fetchDetail(baseUrl, apiKey, mediaType, id);
    const title = getTitle(detail, mediaType);
    if (!title) return;

    const canonicalUrl = `${siteUrl}${pathname}`;
    const description = buildDescription(detail, mediaType, title);
    const image = getImage(detail);
    const jsonLd = buildJsonLd(
      detail,
      mediaType,
      title,
      description,
      canonicalUrl,
      image,
    );
    const html = injectSeo(
      baseHtml,
      seoHead({ canonicalUrl, description, image, jsonLd, mediaType, title }),
    );
    const outputDir = resolve(distDir, pathname.slice(1));

    await mkdir(outputDir, { recursive: true });
    await writeFile(resolve(outputDir, "index.html"), html);
  } catch (error) {
    console.warn(`Skipping ${pathname}: ${error.message}`);
  }
});

console.log(
  `Prerendered SEO HTML for ${details.length} detail URLs, ${collectionSeoPages.length} collections, and ${staticSeoPages.length} static pages.`,
);
