import { Helmet } from "react-helmet-async";
import { buildCanonical, seoConfig } from "./config";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article" | "video.movie" | "video.tv_show";
  keywords?: string[];
  noIndex?: boolean;
  jsonLd?: JsonLd;
}

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${seoConfig.siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function SEO({
  title,
  description,
  path = "/",
  image = seoConfig.defaultImage,
  imageAlt = seoConfig.siteName,
  type = "website",
  keywords,
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const pageTitle = title.includes(seoConfig.siteName)
    ? title
    : `${title} | ${seoConfig.siteName}`;
  const canonicalUrl = buildCanonical(path);
  const imageUrl = image
    ? absoluteUrl(image)
    : absoluteUrl(seoConfig.defaultImage);
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords?.length ? (
        <meta name="keywords" content={keywords.join(", ")} />
      ) : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
