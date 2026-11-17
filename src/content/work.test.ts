import { describe, it, expect } from "vitest";
import { slugify, uniqueId, validateWorkCategories, getCategory, isSafeImagePath } from "./work";
import type { WorkCategory } from "./manifest";

const cat = (over: Partial<WorkCategory> = {}): WorkCategory => ({
  id: "wedding-events",
  title: "Wedding Events",
  description: "Grand celebrations.",
  images: ["/images/events/a.webp"],
  ...over,
});

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Wedding Events")).toBe("wedding-events");
  });
  it("strips symbols and collapses separators", () => {
    expect(slugify("  Social & Community  Gatherings! ")).toBe("social-community-gatherings");
  });
  it("falls back to 'category' when nothing usable remains", () => {
    expect(slugify("!!!")).toBe("category");
  });
});

describe("uniqueId", () => {
  it("returns the slug when unused", () => {
    expect(uniqueId("Baby Shower", ["wedding-events"])).toBe("baby-shower");
  });
  it("appends a counter when the slug is taken", () => {
    expect(uniqueId("Wedding Events", ["wedding-events", "wedding-events-2"])).toBe("wedding-events-3");
  });
});

describe("isSafeImagePath", () => {
  it("accepts normal image paths", () => {
    expect(isSafeImagePath("/images/work/wedding-events/ab12.webp")).toBe(true);
    expect(isSafeImagePath("/images/services/3.JPG")).toBe(true);
  });
  it("rejects traversal and paths outside /images/", () => {
    expect(isSafeImagePath("/images/../src/app/page.tsx")).toBe(false);
    expect(isSafeImagePath("/etc/passwd")).toBe(false);
    expect(isSafeImagePath("/images/a b.webp")).toBe(false);
  });
});

describe("validateWorkCategories", () => {
  it("accepts a valid list", () => {
    expect(validateWorkCategories([cat()])).toBeNull();
  });
  it("accepts a category with no photos yet", () => {
    expect(validateWorkCategories([cat({ images: [] })])).toBeNull();
  });
  it("rejects a non-array", () => {
    expect(validateWorkCategories("nope")).not.toBeNull();
  });
  it("rejects an empty title", () => {
    expect(validateWorkCategories([cat({ title: "   " })])).toMatch(/title/i);
  });
  it("rejects duplicate ids", () => {
    expect(validateWorkCategories([cat(), cat({ title: "Other" })])).toMatch(/duplicate/i);
  });
  it("rejects an id that is not a slug", () => {
    expect(validateWorkCategories([cat({ id: "Bad ID" })])).not.toBeNull();
  });
  it("rejects unsafe image paths", () => {
    expect(validateWorkCategories([cat({ images: ["/images/../secret"] })])).not.toBeNull();
  });
  it("rejects an over-long description", () => {
    expect(validateWorkCategories([cat({ description: "x".repeat(601) })])).toMatch(/description/i);
  });
});

describe("getCategory", () => {
  it("finds a category by id", () => {
    expect(getCategory([cat()], "wedding-events")?.title).toBe("Wedding Events");
  });
  it("returns undefined for an unknown id", () => {
    expect(getCategory([cat()], "missing")).toBeUndefined();
  });
});
