import data from "./site-images.json";

export type SiteImages = {
  hero: string[];
  events: string[];
  services: [string, string, string];
  legacy: [string, string, string];
  founder: string;
  logo: string;
};

export const siteImages = data as SiteImages;

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function validateManifest(m: unknown): m is SiteImages {
  if (!m || typeof m !== "object") return false;
  const o = m as Record<string, unknown>;
  const triple = (v: unknown) => isStringArray(v) && v.length === 3;
  return (
    isStringArray(o.hero) &&
    isStringArray(o.events) &&
    triple(o.services) &&
    triple(o.legacy) &&
    typeof o.founder === "string" &&
    typeof o.logo === "string"
  );
}

export function flattenPaths(m: SiteImages): string[] {
  return [...m.hero, ...m.events, ...m.services, ...m.legacy, m.founder, m.logo];
}

/** Web paths present in `original` but not in `next` (and under /images/). */
export function deletedPaths(original: SiteImages, next: SiteImages): string[] {
  const keep = new Set(flattenPaths(next));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of flattenPaths(original)) {
    if (seen.has(p)) continue;
    seen.add(p);
    if (!keep.has(p) && p.startsWith("/images/")) out.push(p);
  }
  return out;
}
