import data from "./site-images.json";
import { validateWorkCategories } from "./work";

/** A kind of event Rangved runs. Drives the home-page Events carousel and the /our-work galleries. */
export type WorkCategory = {
  id: string; // URL slug, stable once created
  title: string;
  description: string;
  images: string[]; // first images double as the carousel collage / card cover
};

export type SiteImages = {
  hero: string[];
  contact: string[];
  services: [string, string, string];
  legacy: [string, string, string];
  founder: string;
  logo: string;
  workCategories: WorkCategory[];
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
    isStringArray(o.contact) &&
    triple(o.services) &&
    triple(o.legacy) &&
    typeof o.founder === "string" &&
    typeof o.logo === "string" &&
    validateWorkCategories(o.workCategories) === null
  );
}

export function flattenPaths(m: SiteImages): string[] {
  return [
    ...m.hero,
    ...m.contact,
    ...m.services,
    ...m.legacy,
    m.founder,
    m.logo,
    ...m.workCategories.flatMap((c) => c.images),
  ];
}

/** "+2 -1", "reordered", or "" when the two lists are identical. */
function describeListChange(o: string[], n: string[]): string {
  const added = n.filter((p) => !o.includes(p)).length;
  const removed = o.filter((p) => !n.includes(p)).length;
  if (added || removed) {
    const bits: string[] = [];
    if (added) bits.push(`+${added}`);
    if (removed) bits.push(`-${removed}`);
    return bits.join(" ");
  }
  return o.join("|") !== n.join("|") ? "reordered" : "";
}

function summarizeWork(original: WorkCategory[], next: WorkCategory[]): string[] {
  const parts: string[] = [];
  const byId = new Map(original.map((c) => [c.id, c]));
  const nextIds = new Set(next.map((c) => c.id));

  for (const c of next) {
    const before = byId.get(c.id);
    if (!before) {
      parts.push(`Work +category ${c.title}`);
      continue;
    }
    const photos = describeListChange(before.images, c.images);
    if (photos) parts.push(`${c.title} ${photos}`);
    if (before.title !== c.title || before.description !== c.description) {
      parts.push(`${c.title} text edited`);
    }
  }
  for (const c of original) {
    if (!nextIds.has(c.id)) parts.push(`Work -category ${c.title}`);
  }
  const orderChanged =
    original.filter((c) => nextIds.has(c.id)).map((c) => c.id).join("|") !==
    next.filter((c) => byId.has(c.id)).map((c) => c.id).join("|");
  if (orderChanged) parts.push("Work categories reordered");
  return parts;
}

/** Human-readable summary of what changed between two manifests, for the commit message. */
export function summarizeChanges(original: SiteImages, next: SiteImages): string {
  const parts: string[] = [];

  const galleries: { key: "hero" | "contact"; label: string }[] = [
    { key: "hero", label: "Hero" },
    { key: "contact", label: "Get-in-Touch" },
  ];
  for (const { key, label } of galleries) {
    const change = describeListChange(original[key], next[key]);
    if (change) parts.push(`${label} ${change}`);
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

  parts.push(...summarizeWork(original.workCategories, next.workCategories));

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
