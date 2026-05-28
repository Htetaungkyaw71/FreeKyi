/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_MOVIE_APIKEY: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_VIDEO_NAME?: string;
  readonly VITE_VIDEO_URL: string;
  readonly VITE_VIDEO_SERVER_1_NAME?: string;
  readonly VITE_VIDEO_SERVER_1_URL?: string;
  readonly VITE_VIDEO_SERVER_1_MOVIE_URL?: string;
  readonly VITE_VIDEO_SERVER_1_TV_URL?: string;
  readonly VITE_VIDEO_SERVER_2_NAME?: string;
  readonly VITE_VIDEO_SERVER_2_URL?: string;
  readonly VITE_VIDEO_SERVER_2_MOVIE_URL?: string;
  readonly VITE_VIDEO_SERVER_2_TV_URL?: string;
  readonly VITE_VIDEO_SERVER_3_NAME?: string;
  readonly VITE_VIDEO_SERVER_3_URL?: string;
  readonly VITE_VIDEO_SERVER_3_MOVIE_URL?: string;
  readonly VITE_VIDEO_SERVER_3_TV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
