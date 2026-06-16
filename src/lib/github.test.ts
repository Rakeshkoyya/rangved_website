import { describe, it, expect } from "vitest";
import { webPathToRepoPath, buildDeletionEntries } from "./github";

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
});
