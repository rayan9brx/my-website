function hostOf(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

/** True when Origin (or Referer) matches the Host header or SITE_URL. */
export function isAllowedOrigin(request: Request): boolean {
  const source =
    hostOf(request.headers.get("origin")) ?? hostOf(request.headers.get("referer"));
  if (!source) return false;
  const allowed = new Set<string>();
  const host = request.headers.get("host")?.toLowerCase();
  if (host) allowed.add(host);
  const siteHost = hostOf(process.env.SITE_URL);
  if (siteHost) allowed.add(siteHost);
  return allowed.has(source);
}
