import { normalizeBasename } from "./configUtils";

// App configuration
export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  basename: normalizeBasename(import.meta.env.VITE_WEB_BASENAME),
  version: "1.0.0",
};
