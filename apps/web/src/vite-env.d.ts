/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_WEB_BASENAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
