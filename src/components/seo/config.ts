export const seoConfig = {
  siteName: "FreeKyi",
  alternateSiteName: "Freekyi",
  siteUrl: "https://www.freekyi.com",
  defaultImage: "/web-app-manifest-512x512.png",
};

export function buildCanonical(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
