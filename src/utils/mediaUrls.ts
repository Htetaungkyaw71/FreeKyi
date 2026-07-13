import type { Movie, TVSeries } from "../types";

export function slugifyTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getMediaTitle(item: Movie | TVSeries) {
  return (item as Movie).title ?? (item as TVSeries).name ?? "";
}

export function getMediaPath(
  mediaType: "movie" | "tv",
  item: Movie | TVSeries,
) {
  return `/${mediaType}/${item.id}`;
}

export function parseMediaId(idParam?: string) {
  const match = idParam?.match(/^\d+/);
  return match ? Number(match[0]) : 0;
}
