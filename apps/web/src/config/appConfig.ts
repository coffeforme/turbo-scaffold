import { normalizeBasename } from "./configUtils";

export const appConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  basename: normalizeBasename(import.meta.env.BASE_URL),
  version: "1.0.0",
};