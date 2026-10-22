/**
 * Prefix a root-relative path with the configured `base`, so links keep
 * working when the site is served from a subpath such as GitHub Pages
 * (`https://user.github.io/repo/`).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}

/** Absolute URL for `path` when `site` is set, otherwise the base-prefixed path. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const href = withBase(path);
  return site ? new URL(href, site).href : href;
}
