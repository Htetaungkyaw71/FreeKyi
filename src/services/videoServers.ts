import type { MediaType } from "../types";

export interface VideoServer {
  id: string;
  name: string;
  embedUrl: string;
}

interface VideoServerTemplate {
  id: string;
  name?: string;
  baseUrl?: string;
  movieTemplate?: string;
  tvTemplate?: string;
  usesEmbedPath?: boolean;
}

interface VideoServerParams {
  id: number;
  type: MediaType;
  season?: number;
  episode?: number;
}

const optionalServers: VideoServerTemplate[] = [
  {
    id: "server-1",
    name: import.meta.env.VITE_VIDEO_SERVER_1_NAME,
    baseUrl: import.meta.env.VITE_VIDEO_SERVER_1_URL,
    movieTemplate: import.meta.env.VITE_VIDEO_SERVER_1_MOVIE_URL,
    tvTemplate: import.meta.env.VITE_VIDEO_SERVER_1_TV_URL,
    usesEmbedPath: false,
  },
];

const fallbackServers: VideoServerTemplate[] = [
  {
    id: "server-3",
    name: import.meta.env.VITE_VIDEO_SERVER_3_NAME,
    baseUrl: import.meta.env.VITE_VIDEO_SERVER_3_URL,
    movieTemplate: import.meta.env.VITE_VIDEO_SERVER_3_MOVIE_URL,
    tvTemplate: import.meta.env.VITE_VIDEO_SERVER_3_TV_URL,
    usesEmbedPath: true,
  },
];

function cleanBaseUrl(value?: string) {
  return value?.replace(/\/$/, "");
}

function applyTemplate(template: string, params: VideoServerParams) {
  const season = params.season ?? 1;
  const episode = params.episode ?? 1;

  return template
    .replaceAll("{id}", String(params.id))
    .replaceAll("{tmdb}", String(params.id))
    .replaceAll("{type}", params.type)
    .replaceAll("{season}", String(season))
    .replaceAll("{episode}", String(episode));
}

function hasTemplateTokens(value: string) {
  return /\{(?:id|tmdb|type|season|episode)\}/.test(value);
}

function buildPathVideoUrl(
  baseUrl: string,
  params: VideoServerParams,
  usesEmbedPath = true,
) {
  const cleanUrl = cleanBaseUrl(baseUrl);
  if (!cleanUrl) return null;

  const pathPrefix = usesEmbedPath ? "/embed" : "";

  if (params.type === "movie") {
    return `${cleanUrl}${pathPrefix}/movie/${params.id}`;
  }

  return `${cleanUrl}${pathPrefix}/tv/${params.id}/${params.season ?? 1}/${params.episode ?? 1}`;
}

function buildOptionalServerUrl(
  server: VideoServerTemplate,
  params: VideoServerParams,
) {
  const template =
    params.type === "movie" ? server.movieTemplate : server.tvTemplate;

  if (template && hasTemplateTokens(template)) {
    return applyTemplate(template, params);
  }

  const baseUrl = server.baseUrl || template;
  return baseUrl
    ? buildPathVideoUrl(baseUrl, params, server.usesEmbedPath)
    : null;
}

export function getVideoServers({
  id,
  type,
  season = 1,
  episode = 1,
}: VideoServerParams): VideoServer[] {
  const primaryBaseUrl = cleanBaseUrl(import.meta.env.VITE_VIDEO_URL);
  const primaryUrl =
    type === "movie"
      ? `${primaryBaseUrl}/embed/movie?tmdb=${id}`
      : `${primaryBaseUrl}/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;

  const servers: VideoServer[] = [];

  optionalServers.forEach((server, index) => {
    const embedUrl = buildOptionalServerUrl(server, {
      id,
      type,
      season,
      episode,
    });
    if (!embedUrl) return;

    servers.push({
      id: server.id,
      name: server.name || `Server ${index + 1}`,
      embedUrl,
    });
  });

  if (primaryBaseUrl) {
    servers.push({
      id: "server-2",
      name: import.meta.env.VITE_VIDEO_NAME || "Server 2",
      embedUrl: primaryUrl,
    });
  }

  fallbackServers.forEach((server, index) => {
    const embedUrl = buildOptionalServerUrl(server, {
      id,
      type,
      season,
      episode,
    });
    if (!embedUrl) return;

    servers.push({
      id: server.id,
      name: server.name || `Server ${index + 4}`,
      embedUrl,
    });
  });

  return servers;
}
