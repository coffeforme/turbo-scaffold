const DEFAULT_BASENAME = "/";

export function normalizeBasename(value?: string) {
  if (!value) {
    return DEFAULT_BASENAME;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === "/") {
    return DEFAULT_BASENAME;
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  const withLeadingSlash = withoutTrailingSlash.startsWith("/")
    ? withoutTrailingSlash
    : `/${withoutTrailingSlash}`;

  return withLeadingSlash || DEFAULT_BASENAME;
}

export function toViteBase(basename: string) {
  return basename === "/" ? "/" : `${basename}/`;
}
