import { appConfig } from "./appConfig";

export function restoreGitHubPagesRoute(basename = appConfig.basename) {
  const redirect = window.location.search;

  if (!redirect.startsWith("?/")) {
    return;
  }

  const restoredPath = redirect.slice(1);
  const basePath = basename === "/" ? "" : basename;
  const nextUrl = `${basePath}${restoredPath}`;

  window.history.replaceState(null, "", nextUrl);
}
