import data from "./site-images.json";

export type SiteImages = {
  hero: string[];
  events: string[];
  contact: string[];
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
    isStringArray(o.contact) &&
    triple(o.services) &&
    triple(o.legacy) &&
    typeof o.founder === "string" &&
    typeof o.logo === "string"
  );
}

export function flattenPaths(m: SiteImages): string[] {
  return [...m.hero, ...m.events, ...m.contact, ...m.services, ...m.legacy, m.founder, m.logo];
}

/** Human-readable summary of what changed between two manifests, for the commit message. */
export function summarizeChanges(original: SiteImages, next: SiteImages): string {
  const parts: string[] = [];

  const galleries: { key: "hero" | "events" | "contact"; label: string }[] = [
    { key: "hero", label: "Hero" },
    { key: "events", label: "Events" },
    { key: "contact", label: "Get-in-Touch" },
  ];
  for (const { key, label } of galleries) {
    const o = original[key];
    const n = next[key];
    const added = n.filter((p) => !o.includes(p)).length;
    const removed = o.filter((p) => !n.includes(p)).length;
    if (added || removed) {
      const bits: string[] = [];
      if (added) bits.push(`+${added}`);
      if (removed) bits.push(`-${removed}`);
      parts.push(`${label} ${bits.join(" ")}`);
    } else if (o.join("|") !== n.join("|")) {
      parts.push(`${label} reordered`);
    }
  }

  const slots: { key: "services" | "legacy"; label: string }[] = [
    { key: "services", label: "Services" },
    { key: "legacy", label: "Legacy" },
  ];
  for (const { key, label } of slots) {
    const o = original[key];
    const n = next[key];
    const replaced = o.reduce((count, p, i) => count + (p !== n[i] ? 1 : 0), 0);
    if (replaced) parts.push(`${label} replaced ${replaced}`);
  }

  const singles: { key: "founder" | "logo"; label: string }[] = [
    { key: "founder", label: "Founder" },
    { key: "logo", label: "Logo" },
  ];
  for (const { key, label } of singles) {
    if (original[key] !== next[key]) parts.push(`${label} replaced`);
  }

  return parts.length ? parts.join(", ") : "update site images";
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
