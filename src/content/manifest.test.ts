import { describe, it, expect } from "vitest";
import { validateManifest, flattenPaths, deletedPaths, type SiteImages } from "./manifest";

const base: SiteImages = {
  hero: ["/images/hero/a.webp", "/images/hero/b.webp"],
  events: ["/images/events/c.webp"],
  services: ["/images/services/1.webp", "/images/services/2.webp", "/images/services/3.webp"],
  legacy: ["/images/work_legacy/1.webp", "/images/work_legacy/2.webp", "/images/work_legacy/3.webp"],
  founder: "/images/founder/f.webp",
  logo: "/images/founder/logo.webp",
};

describe("validateManifest", () => {
  it("accepts a well-formed manifest", () => {
    expect(validateManifest(base)).toBe(true);
  });
  it("rejects a non-object", () => {
    expect(validateManifest(null)).toBe(false);
    expect(validateManifest("x")).toBe(false);
  });
  it("rejects when services is not exactly 3", () => {
    expect(validateManifest({ ...base, services: ["/images/services/1.webp"] })).toBe(false);
  });
  it("rejects when founder is not a string", () => {
    expect(validateManifest({ ...base, founder: 123 })).toBe(false);
  });
});

describe("deletedPaths", () => {
  it("returns paths removed from the original", () => {
    const next: SiteImages = { ...base, hero: ["/images/hero/a.webp"] };
    expect(deletedPaths(base, next)).toEqual(["/images/hero/b.webp"]);
  });
  it("treats a replace as one deletion (old) when new path differs", () => {
    const next: SiteImages = { ...base, founder: "/images/founder/g.webp" };
    expect(deletedPaths(base, next)).toEqual(["/images/founder/f.webp"]);
  });
  it("does not delete a path that is still referenced elsewhere", () => {
    const shared: SiteImages = { ...base, events: [...base.hero] };
    const next: SiteImages = { ...shared, hero: [] };
    // both hero paths still appear under events → no deletions
    expect(deletedPaths(shared, next)).toEqual([]);
  });
  it("flattenPaths includes every section", () => {
    expect(flattenPaths(base)).toHaveLength(2 + 1 + 3 + 3 + 1 + 1);
  });
});
