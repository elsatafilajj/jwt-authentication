/// <reference types="vite/client" />

declare module "*.png";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add any other env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
