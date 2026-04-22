import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { normalizeBasename, toViteBase } from "./src/config/configUtils";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basename = normalizeBasename(env.VITE_WEB_BASENAME);

  return {
    plugins: [react()],
    base: toViteBase(basename),
  };
});
