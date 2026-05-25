export const seoConfig = {
  siteName: "FreeKyi",
  siteUrl: "https://freekyi.vercel.app",
  defaultImage: "/web-app-manifest-512x512.png",
};

export function buildCanonical(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
