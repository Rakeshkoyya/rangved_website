import type { WorkCategory } from "./manifest";

export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 600;
export const MAX_CATEGORIES = 40;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PATH_RE = /^\/images\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+$/;

/** Turns a display title into a URL-safe id, e.g. "Social & Community" -> "social-community". */
export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "category";
}

/** A slug for `title` that doesn't collide with any of `taken`. */
export function uniqueId(title: string, taken: string[]): string {
  const base = slugify(title);
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** True for web paths under /images/ with no traversal or odd characters. */
export function isSafeImagePath(path: string): boolean {
  return IMAGE_PATH_RE.test(path) && !path.includes("..");
}

/** Returns a human-readable problem with the list, or null when it is valid. */
export function validateWorkCategories(value: unknown): string | null {
  if (!Array.isArray(value)) return "Work categories must be a list";
  if (value.length > MAX_CATEGORIES) return `At most ${MAX_CATEGORIES} categories are allowed`;

  const seen = new Set<string>();
  for (const [i, raw] of value.entries()) {
    const label = `Category ${i + 1}`;
    if (!raw || typeof raw !== "object") return `${label} is malformed`;
    const c = raw as Record<string, unknown>;

    if (typeof c.id !== "string" || !SLUG_RE.test(c.id)) return `${label} has an invalid id`;
    if (seen.has(c.id)) return `Duplicate category id "${c.id}"`;
    seen.add(c.id);

    if (typeof c.title !== "string" || !c.title.trim()) return `${label} needs a title`;
    if (c.title.length > MAX_TITLE_LENGTH) return `${label} title is longer than ${MAX_TITLE_LENGTH} characters`;

    if (typeof c.description !== "string") return `${label} has an invalid description`;
    if (c.description.length > MAX_DESCRIPTION_LENGTH) {
      return `${label} description is longer than ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (!Array.isArray(c.images) || !c.images.every((p) => typeof p === "string" && isSafeImagePath(p))) {
      return `${label} has an invalid image path`;
    }
  }
  return null;
}

export function getCategory(categories: WorkCategory[], id: string): WorkCategory | undefined {
  return categories.find((c) => c.id === id);
}
