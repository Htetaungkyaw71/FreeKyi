import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const outputPath = resolve(rootDir, "public/sitemap.xml");
const siteUrl = (
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  "https://freekyi.vercel.app"
).replace(/\/$/, "");

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

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugifyTitle(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getTitle(item) {
  return item.title || item.name || item.original_title || item.original_name || "";
}

function getDetailPath(mediaType, item) {
  const slug = slugifyTitle(getTitle(item));
  return `/${mediaType}/${item.id}${slug ? `-${slug}` : ""}`;
}

function createStaticUrls(today) {
  const collectionUrls = [
    "korean-drama",
    "anime-series",
    "horror-night",
    "action-movies",
    "romantic-movies",
    "marvel-movies",
    "comedy-movies",
    "new-movies-2026",
  ].map((slug) => ({
    loc: `/collections/${slug}`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  }));

  return [
    { loc: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
    { loc: "/movies", lastmod: today, changefreq: "daily", priority: "0.8" },
    {
      loc: "/movies?sort=now_playing",
      lastmod: today,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: "/movies?sort=upcoming",
      lastmod: today,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: "/movies?genre=28",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.6",
    },
    {
      loc: "/movies?genre=27",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.6",
    },
    {
      loc: "/movies?genre=16",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.6",
    },
    { loc: "/tv", lastmod: today, changefreq: "daily", priority: "0.8" },
    {
      loc: "/tv?country=KR",
      lastmod: today,
      changefreq: "daily",
      priority: "0.7",
    },
    {
      loc: "/tv?sort=airing_today",
      lastmod: today,
      changefreq: "daily",
      priority: "0.7",
    },
    ...collectionUrls,
  ];
}

function tmdbJobs() {
  return [
    { mediaType: "movie", endpoint: "/trending/movie/week", pages: 3 },
    { mediaType: "movie", endpoint: "/movie/popular", pages: 3 },
    { mediaType: "movie", endpoint: "/movie/now_playing", pages: 3 },
    { mediaType: "movie", endpoint: "/movie/upcoming", pages: 3 },
    { mediaType: "movie", endpoint: "/movie/top_rated", pages: 2 },
    {
      mediaType: "movie",
      endpoint: "/discover/movie",
      pages: 2,
      params: { with_genres: "28", sort_by: "popularity.desc" },
    },
    {
      mediaType: "movie",
      endpoint: "/discover/movie",
      pages: 2,
      params: { with_genres: "27", sort_by: "popularity.desc" },
    },
    {
      mediaType: "movie",
      endpoint: "/discover/movie",
      pages: 2,
      params: { with_genres: "16", sort_by: "popularity.desc" },
    },
    { mediaType: "tv", endpoint: "/trending/tv/week", pages: 3 },
    { mediaType: "tv", endpoint: "/tv/popular", pages: 3 },
    { mediaType: "tv", endpoint: "/tv/top_rated", pages: 2 },
    { mediaType: "tv", endpoint: "/tv/airing_today", pages: 3 },
    {
      mediaType: "tv",
      endpoint: "/discover/tv",
      pages: 2,
      params: { with_origin_country: "KR", sort_by: "popularity.desc" },
    },
  ];
}

async function fetchTmdb(baseUrl, apiKey, job, page) {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${job.endpoint}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", String(page));
  for (const [key, value] of Object.entries(job.params ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${job.endpoint}`);
  }
  return response.json();
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function fetchTmdbWithRetry(baseUrl, apiKey, job, page, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchTmdb(baseUrl, apiKey, job, page);
    } catch (error) {
      if (attempt === attempts) throw error;
      await wait(250 * attempt);
    }
  }

  return { results: [] };
}

async function getDynamicUrls(today) {
  const apiKey = process.env.VITE_MOVIE_APIKEY;
  const baseUrl = process.env.VITE_BASE_URL || "https://api.themoviedb.org/3";

  if (!apiKey) {
    console.warn("Missing VITE_MOVIE_APIKEY; generating static sitemap only.");
    return [];
  }

  const seen = new Set();
  const urls = [];
  const jobs = tmdbJobs();

  for (const job of jobs) {
    for (let page = 1; page <= job.pages; page += 1) {
      try {
        const data = await fetchTmdbWithRetry(baseUrl, apiKey, job, page);
        for (const item of data.results ?? []) {
          if (!item?.id || item.adult) continue;
          const key = `${job.mediaType}:${item.id}`;
          if (seen.has(key)) continue;
          seen.add(key);
          urls.push({
            loc: getDetailPath(job.mediaType, item),
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          });
        }
      } catch (error) {
        console.warn(`Skipping ${job.endpoint} page ${page}: ${error.message}`);
      }
    }
  }

  return urls;
}

function renderSitemap(urls) {
  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(`${siteUrl}${url.loc}`)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${escapeXml(url.priority)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

await loadEnv();
const today = new Date().toISOString().slice(0, 10);
const urls = [...createStaticUrls(today), ...(await getDynamicUrls(today))];

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, renderSitemap(urls));
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
