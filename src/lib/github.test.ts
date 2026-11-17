import { describe, it, expect } from "vitest";
import { webPathToRepoPath, buildDeletionEntries, sanitizeNewFiles } from "./github";

describe("webPathToRepoPath", () => {
  it("maps a public web path to its repo path", () => {
    expect(webPathToRepoPath("/images/hero/a.webp")).toBe("public/images/hero/a.webp");
  });
  it("tolerates a missing leading slash", () => {
    expect(webPathToRepoPath("images/hero/a.webp")).toBe("public/images/hero/a.webp");
  });
});

describe("buildDeletionEntries", () => {
  it("creates null-sha tree entries for /images/ paths", () => {
    expect(buildDeletionEntries(["/images/hero/a.webp"])).toEqual([
      { path: "public/images/hero/a.webp", mode: "100644", type: "blob", sha: null },
    ]);
  });
  it("ignores non-/images paths defensively", () => {
    expect(buildDeletionEntries(["/etc/passwd", "/images/x.webp"])).toEqual([
      { path: "public/images/x.webp", mode: "100644", type: "blob", sha: null },
    ]);
  });
  it("ignores traversal paths that start with /images/", () => {
    expect(buildDeletionEntries(["/images/../src/app/page.tsx"])).toEqual([]);
  });
});

describe("sanitizeNewFiles", () => {
  it("keeps well-formed webp uploads", () => {
    const f = { path: "/images/work/weddings/ab12.webp", base64: "AAAA" };
    expect(sanitizeNewFiles([f])).toEqual([f]);
  });
  it("drops uploads outside /images/ or with traversal", () => {
    expect(
      sanitizeNewFiles([
        { path: "/images/../src/x.webp", base64: "AAAA" },
        { path: "/src/app/page.tsx", base64: "AAAA" },
        { path: "/images/x.png", base64: "AAAA" },
      ])
    ).toEqual([]);
  });
  it("drops malformed entries", () => {
    expect(sanitizeNewFiles([null, { path: 1 }, "x"])).toEqual([]);
    expect(sanitizeNewFiles("nope")).toEqual([]);
  });
});
