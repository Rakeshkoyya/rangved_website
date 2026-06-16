# Admin Asset Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a password-protected `/admin` page where the site owner adds/removes/replaces image assets and publishes them as a single GitHub commit that triggers Vercel's auto-deploy.

**Architecture:** Move all editable image paths into one `src/content/site-images.json` manifest that every component reads. Drop pure static-export so we get two Node route handlers: `/api/admin/login` (password → signed HttpOnly cookie) and `/api/admin/commit` (validates cookie → writes the manifest + new image files + deletions to GitHub via the Git Data API in one atomic commit). Uploaded images are compressed to visually-lossless WebP in the browser before upload.

**Tech Stack:** Next.js 16.2.4 (App Router, route handlers), React 19, TypeScript, Tailwind 3, Node `crypto` (HMAC session), browser Canvas/`crypto.subtle` (compression + hashing), GitHub REST Git Data API via `fetch`, Vitest (unit tests for pure logic).

---

## Reference facts (verified against the codebase)

- `tsconfig.json`: `"@/*" -> "./src/*"`, `resolveJsonModule: true` → `import x from "@/content/site-images.json"` works and is typed.
- Next 16: `cookies()` and `headers()` are **async**. In route handlers, read request cookies via `request.cookies.get(name)?.value` (NextRequest) and set response cookies via `response.cookies.set(...)` (NextResponse). Route handlers run in the Node runtime by default; we set `export const runtime = "nodejs"` explicitly because we use Node `crypto`.
- Current image references (these exact values go into the manifest so there is **zero visual change**):
  - Hero gallery — `src/app/components/Hero.tsx` `heroImages` (7) + the logo badge.
  - Events — `src/app/components/Events.tsx` `backgroundImages` (6).
  - Contact background — `src/app/components/ContactNew.tsx` `heroImages` (duplicate of hero).
  - Services — `src/app/components/ServicesNew.tsx` `carouselSlides[0..2].image` (3).
  - Legacy — `src/app/components/LegacyTimeline.tsx` `categories[0..2].image` (3).
  - Founder — `src/app/components/FounderNew.tsx` `founder.jpg`.
  - Logo — `Navigation.tsx`, `FooterNew.tsx`, `Hero.tsx` badge, `layout.tsx` (icons + jsonLd).
  - SEO — `src/app/layout.tsx` og/twitter/jsonLd use `/images/hero/1.JPG` and `/images/founder/rangved.png`.

---

## Task 1: Project config & test tooling

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/robots.ts`
- Modify: `.gitignore`
- Create: `.env.example`
- Modify: `package.json` (script + devDeps via npm)
- Create: `vitest.config.ts`

- [ ] **Step 1: Drop pure static-export so route handlers can run**

Edit `next.config.ts` — remove only the `output` line; keep `distDir` and `images.unoptimized` so live rendering is unchanged:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 2: Keep `/admin` and `/api` out of search engines**

Edit `src/app/robots.ts` so the rules disallow admin/api:

```ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.rangvedtheatre.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

(The previous `export const dynamic = "force-static"` line is removed; it was only needed for `output: "export"`.)

- [ ] **Step 3: Allow committing an env example**

Append to `.gitignore` (the existing `.env*` rule would otherwise hide it):

```
# allow the committed example (real secrets stay in .env.local)
!.env.example
```

- [ ] **Step 4: Document required env vars**

Create `.env.example`:

```
# Admin login password (checked server-side)
ADMIN_PASSWORD=change-me

# Secret used to sign the admin session cookie (any long random string)
ADMIN_SESSION_SECRET=generate-a-long-random-string

# Fine-grained GitHub token with Contents: Read and write on this repo
GITHUB_TOKEN=github_pat_xxx

# Target repo and branch the admin commits to
GITHUB_REPO=Rakeshkoyya/rangved_website
GITHUB_BRANCH=main
```

- [ ] **Step 5: Install Vitest and add a test script**

Run: `npm install -D vitest`
Then edit `package.json` `scripts` to add:

```json
    "test": "vitest run"
```

- [ ] **Step 6: Minimal Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 7: Verify the app still builds and the test runner works**

Run: `npm run build`
Expected: build succeeds (now a server build, not export).
Run: `npx vitest run`
Expected: "No test files found" (no tests yet) — exits without crashing.

- [ ] **Step 8: Commit**

```bash
git add next.config.ts src/app/robots.ts .gitignore .env.example package.json package-lock.json vitest.config.ts
git commit -m "chore: enable server runtime + add vitest tooling"
```

---

## Task 2: Image manifest (single source of truth) + helpers

**Files:**
- Create: `src/content/site-images.json`
- Create: `src/content/manifest.ts`
- Test: `src/content/manifest.test.ts`

- [ ] **Step 1: Create the manifest data file (mirrors current live values exactly)**

Create `src/content/site-images.json`:

```json
{
  "hero": [
    "/images/hero/1.JPG",
    "/images/hero/2.JPG",
    "/images/hero/3.PNG",
    "/images/hero/4.PNG",
    "/images/hero/5.PNG",
    "/images/hero/6.jpeg",
    "/images/hero/7.jpeg"
  ],
  "events": [
    "/images/events/1.jpeg",
    "/images/events/2.png",
    "/images/events/3.JPG",
    "/images/events/4.JPG",
    "/images/events/5.PNG",
    "/images/events/6.jpg"
  ],
  "services": [
    "/images/services/1.jpeg",
    "/images/services/2.png",
    "/images/services/5.PNG"
  ],
  "legacy": [
    "/images/work_legacy/6.jpg",
    "/images/work_legacy/4.JPG",
    "/images/work_legacy/5.jpeg"
  ],
  "founder": "/images/founder/founder.jpg",
  "logo": "/images/founder/rangved.png"
}
```

- [ ] **Step 2: Write the failing test for the helpers**

Create `src/content/manifest.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/content/manifest.test.ts`
Expected: FAIL — `Cannot find module './manifest'`.

- [ ] **Step 4: Implement the manifest module**

Create `src/content/manifest.ts`:

```ts
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/content/manifest.test.ts`
Expected: PASS (all cases).

- [ ] **Step 6: Commit**

```bash
git add src/content/site-images.json src/content/manifest.ts src/content/manifest.test.ts
git commit -m "feat: add site-images manifest and helpers"
```

---

## Task 3: Point components at the manifest (no visual change)

**Files (modify):** `src/app/components/Hero.tsx`, `Events.tsx`, `ContactNew.tsx`, `ServicesNew.tsx`, `LegacyTimeline.tsx`, `FounderNew.tsx`, `Navigation.tsx`, `FooterNew.tsx`, `src/app/layout.tsx`

Each edit replaces a hardcoded path with the identical value from the manifest, so the rendered site is unchanged.

- [ ] **Step 1: Hero**

In `src/app/components/Hero.tsx`, add the import after the existing imports (below `import Image from "next/image";`):

```ts
import { siteImages } from "@/content/manifest";
```

Replace the `heroImages` array literal:

```ts
const heroImages = [
  "/images/hero/1.JPG",
  "/images/hero/2.JPG",
  "/images/hero/3.PNG",
  "/images/hero/4.PNG",
  "/images/hero/5.PNG",
  "/images/hero/6.jpeg",
  "/images/hero/7.jpeg",
];
```

with:

```ts
const heroImages = siteImages.hero;
```

Replace the logo badge source `src="/images/founder/rangved.png"` (inside the `<h1>`) with:

```tsx
            src={siteImages.logo}
```

- [ ] **Step 2: Events**

In `src/app/components/Events.tsx`, add after `import { ScrollTrigger } ...`:

```ts
import { siteImages } from "@/content/manifest";
```

Replace the `backgroundImages` array literal with:

```ts
const backgroundImages = siteImages.events;
```

- [ ] **Step 3: Contact background**

In `src/app/components/ContactNew.tsx`, add after `import Image from "next/image";`:

```ts
import { siteImages } from "@/content/manifest";
```

Replace the `heroImages` array literal with:

```ts
const heroImages = siteImages.hero;
```

- [ ] **Step 4: Services (3 slots by index)**

In `src/app/components/ServicesNew.tsx`, add after `import Image from "next/image";`:

```ts
import { siteImages } from "@/content/manifest";
```

Change the three `image:` fields in `carouselSlides`:
- slide id 1: `image: "/images/services/1.jpeg",` → `image: siteImages.services[0],`
- slide id 2: `image: "/images/services/2.png",` → `image: siteImages.services[1],`
- slide id 3: `image: "/images/services/5.PNG",` → `image: siteImages.services[2],`

- [ ] **Step 5: Legacy (3 slots by index)**

In `src/app/components/LegacyTimeline.tsx`, add after `import { motion, AnimatePresence } from "framer-motion";`:

```ts
import { siteImages } from "@/content/manifest";
```

Change the three `image:` fields in `categories`:
- corporate: `image: "/images/work_legacy/6.jpg",` → `image: siteImages.legacy[0],`
- school: `image: "/images/work_legacy/4.JPG",` → `image: siteImages.legacy[1],`
- dance: `image: "/images/work_legacy/5.jpeg",` → `image: siteImages.legacy[2],`

- [ ] **Step 6: Founder**

In `src/app/components/FounderNew.tsx`, add `import { siteImages } from "@/content/manifest";` near the top imports, then replace `src="/images/founder/founder.jpg"` with:

```tsx
                    src={siteImages.founder}
```

- [ ] **Step 7: Logo in Navigation and Footer**

In `src/app/components/Navigation.tsx`, add `import { siteImages } from "@/content/manifest";` to the imports, then replace `src="/images/founder/rangved.png"` with `src={siteImages.logo}`.

In `src/app/components/FooterNew.tsx`, add after `import Image from "next/image";`:

```ts
import { siteImages } from "@/content/manifest";
```

then replace `src="/images/founder/rangved.png"` with `src={siteImages.logo}`.

- [ ] **Step 8: SEO metadata + structured data**

In `src/app/layout.tsx`, add after `import "./globals.css";`:

```ts
import { siteImages } from "@/content/manifest";
```

Make these replacements:
- openGraph image `url: "/images/hero/1.JPG",` → `url: siteImages.hero[0],`
- twitter `images: ["/images/hero/1.JPG"],` → `images: [siteImages.hero[0]],`
- jsonLd `logo: \`${SITE_URL}/images/founder/rangved.png\`,` → `logo: \`${SITE_URL}${siteImages.logo}\`,`
- jsonLd `image: \`${SITE_URL}/images/hero/1.JPG\`,` → `image: \`${SITE_URL}${siteImages.hero[0]}\`,`
- icons `icon: "/images/founder/rangved.png",` → `icon: siteImages.logo,`
- icons `apple: "/images/founder/rangved.png",` → `apple: siteImages.logo,`

- [ ] **Step 9: Type-check / build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 10: Verify zero visual regression**

Run the dev server and compare the homepage to before (hero slideshow, events slideshow, services carousel images, legacy tab images, founder photo, nav/footer logo). They must look identical. (Use the preview tools: start server, snapshot/screenshot the homepage.)
Expected: identical rendering.

- [ ] **Step 11: Commit**

```bash
git add src/app/components src/app/layout.tsx
git commit -m "refactor: read all section images from the manifest"
```

---

## Task 4: Session/auth library (HMAC, pure)

**Files:**
- Create: `src/lib/auth.ts`
- Test: `src/lib/auth.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/auth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { signSession, verifySession, checkPassword } from "./auth";

const SECRET = "test-secret-test-secret";
const NOW = 1_000_000_000_000;

describe("session signing", () => {
  it("verifies a freshly signed token", () => {
    const token = signSession(NOW, SECRET);
    expect(verifySession(token, NOW + 1000, SECRET)).toBe(true);
  });
  it("rejects a tampered signature", () => {
    const token = signSession(NOW, SECRET);
    const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");
    expect(verifySession(tampered, NOW + 1000, SECRET)).toBe(false);
  });
  it("rejects an expired token", () => {
    const token = signSession(NOW, SECRET);
    expect(verifySession(token, NOW + 1000 * 60 * 60 * 24, SECRET)).toBe(false);
  });
  it("rejects a token signed with a different secret", () => {
    const token = signSession(NOW, "other-secret-other-secret");
    expect(verifySession(token, NOW + 1000, SECRET)).toBe(false);
  });
  it("rejects undefined / malformed tokens", () => {
    expect(verifySession(undefined, NOW, SECRET)).toBe(false);
    expect(verifySession("garbage", NOW, SECRET)).toBe(false);
  });
});

describe("checkPassword", () => {
  it("accepts the exact password", () => {
    expect(checkPassword("hunter2", "hunter2")).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(checkPassword("nope", "hunter2")).toBe(false);
  });
  it("rejects when expected is empty", () => {
    expect(checkPassword("anything", "")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/auth.test.ts`
Expected: FAIL — `Cannot find module './auth'`.

- [ ] **Step 3: Implement the auth library**

Create `src/lib/auth.ts`:

```ts
import crypto from "crypto";

export const SESSION_COOKIE = "rv_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function hmac(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Returns a stateless token "exp.signature". */
export function signSession(now: number, secret = process.env.ADMIN_SESSION_SECRET || ""): string {
  const exp = now + SESSION_TTL_MS;
  return `${exp}.${hmac(secret, `admin.${exp}`)}`;
}

export function verifySession(
  token: string | undefined,
  now: number,
  secret = process.env.ADMIN_SESSION_SECRET || ""
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < now) return false;
  return safeEqual(sig, hmac(secret, `admin.${exp}`));
}

export function checkPassword(input: string, expected = process.env.ADMIN_PASSWORD || ""): boolean {
  if (!expected) return false;
  return safeEqual(input, expected);
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/auth.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/lib/auth.test.ts
git commit -m "feat: add HMAC session + password helpers"
```

---

## Task 5: Auth route handlers (login / logout / session)

**Files:**
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`
- Create: `src/app/api/admin/session/route.ts`

- [ ] **Step 1: Login route**

Create `src/app/api/admin/login/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, signSession, checkPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, signSession(Date.now()), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
```

- [ ] **Step 2: Logout route**

Create `src/app/api/admin/logout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
```

- [ ] **Step 3: Session-check route**

Create `src/app/api/admin/session/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return NextResponse.json({ authed: verifySession(token, Date.now()) });
}
```

- [ ] **Step 4: Build to confirm the routes type-check**

Run: `npm run build`
Expected: build succeeds; the three `/api/admin/*` routes appear in the build output.

- [ ] **Step 5: Smoke-test locally**

Create `.env.local` with `ADMIN_PASSWORD=hunter2` and `ADMIN_SESSION_SECRET=local-dev-secret-please-change`, then run `npm run dev` and:

Run: `curl -i -X POST localhost:3000/api/admin/login -H "Content-Type: application/json" -d '{"password":"wrong"}'`
Expected: `HTTP/1.1 401` and `{"ok":false,...}`.

Run: `curl -i -X POST localhost:3000/api/admin/login -H "Content-Type: application/json" -d '{"password":"hunter2"}'`
Expected: `HTTP/1.1 200`, body `{"ok":true}`, and a `Set-Cookie: rv_admin=...; HttpOnly` header.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin
git commit -m "feat: add admin login/logout/session routes"
```

---

## Task 6: GitHub commit library + commit route

**Files:**
- Create: `src/lib/github.ts`
- Test: `src/lib/github.test.ts`
- Create: `src/app/api/admin/commit/route.ts`

- [ ] **Step 1: Write the failing test for the pure helpers**

Create `src/lib/github.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/github.test.ts`
Expected: FAIL — `Cannot find module './github'`.

- [ ] **Step 3: Implement the GitHub library**

Create `src/lib/github.ts`:

```ts
const API = "https://api.github.com";

export type CommitFile = { path: string; base64: string }; // path is a web path like /images/hero/x.webp
export type TreeEntry = { path: string; mode: "100644"; type: "blob"; sha: string | null };

export function webPathToRepoPath(webPath: string): string {
  const clean = webPath.startsWith("/") ? webPath : `/${webPath}`;
  return `public${clean}`;
}

export function buildDeletionEntries(deletedWebPaths: string[]): TreeEntry[] {
  return deletedWebPaths
    .filter((p) => p.startsWith("/images/"))
    .map((p) => ({ path: webPathToRepoPath(p), mode: "100644" as const, type: "blob" as const, sha: null }));
}

async function gh(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub ${path} -> ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function commitChanges(opts: {
  repo: string;
  branch: string;
  token: string;
  message: string;
  manifest: unknown;
  newFiles: CommitFile[];
  deletedPaths: string[];
}): Promise<string> {
  const { repo, branch, token, message } = opts;

  // 1. current ref + base tree
  const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`);
  const baseCommitSha: string = ref.object.sha;
  const baseCommit = await gh(token, `/repos/${repo}/git/commits/${baseCommitSha}`);
  const baseTreeSha: string = baseCommit.tree.sha;

  const tree: TreeEntry[] = [];

  // 2. blob for the updated manifest
  const manifestBlob = await gh(token, `/repos/${repo}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({
      content: JSON.stringify(opts.manifest, null, 2) + "\n",
      encoding: "utf-8",
    }),
  });
  tree.push({ path: "src/content/site-images.json", mode: "100644", type: "blob", sha: manifestBlob.sha });

  // 3. blobs for each new image
  for (const file of opts.newFiles) {
    const blob = await gh(token, `/repos/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content: file.base64, encoding: "base64" }),
    });
    tree.push({ path: webPathToRepoPath(file.path), mode: "100644", type: "blob", sha: blob.sha });
  }

  // 4. deletions
  tree.push(...buildDeletionEntries(opts.deletedPaths));

  // 5. new tree
  const newTree = await gh(token, `/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });

  // 6. commit + move the branch
  const commit = await gh(token, `/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommitSha] }),
  });
  await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.html_url as string;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/github.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement the commit route handler**

Create `src/app/api/admin/commit/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { commitChanges, type CommitFile } from "@/lib/github";
import { validateManifest } from "@/content/manifest";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!verifySession(request.cookies.get(SESSION_COOKIE)?.value, Date.now())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !validateManifest(body.manifest)) {
    return NextResponse.json({ ok: false, error: "Invalid manifest" }, { status: 400 });
  }

  const repo = process.env.GITHUB_REPO || "";
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN || "";
  if (!repo || !token) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }

  const newFiles: CommitFile[] = Array.isArray(body.newFiles) ? body.newFiles : [];
  const deletedPaths: string[] = Array.isArray(body.deletedPaths) ? body.deletedPaths : [];

  try {
    const commitUrl = await commitChanges({
      repo,
      branch,
      token,
      message: "chore(admin): update site images",
      manifest: body.manifest,
      newFiles,
      deletedPaths,
    });
    return NextResponse.json({ ok: true, commitUrl });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
```

- [ ] **Step 6: Build to confirm everything type-checks**

Run: `npm run build`
Expected: build succeeds; `/api/admin/commit` appears in output.

- [ ] **Step 7: Commit**

```bash
git add src/lib/github.ts src/lib/github.test.ts src/app/api/admin/commit/route.ts
git commit -m "feat: add GitHub commit library and commit route"
```

---

## Task 7: Client-side image compression

**Files:**
- Create: `src/lib/compressImage.ts`

This module is browser-only (Canvas + `crypto.subtle`); it is verified in the browser during Task 9, not unit-tested.

- [ ] **Step 1: Implement the compression utilities**

Create `src/lib/compressImage.ts`:

```ts
"use client";

export type CompressOptions = { maxDimension?: number; quality?: number };

/** Resize (downscale only) + re-encode to visually-lossless WebP. */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<Blob> {
  const maxDimension = opts.maxDimension ?? 2000;
  const quality = opts.quality ?? 0.82;

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const longEdge = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, maxDimension / longEdge);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas 2D context unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", quality)
  );
  if (!blob) throw new Error("WebP encoding failed");
  return blob;
}

/** First 8 hex chars of the SHA-256 of the blob — used for the filename. */
export async function hashBlob(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/compressImage.ts
git commit -m "feat: add client-side image compression util"
```

---

## Task 8: Admin page UI

**Files:**
- Create: `src/app/admin/sections.config.ts`
- Create: `src/app/admin/Editor.tsx`
- Create: `src/app/admin/AdminApp.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Section configuration**

Create `src/app/admin/sections.config.ts`:

```ts
export type SectionMode = "gallery" | "slots" | "single";

export type SectionConfig = {
  key: "hero" | "events" | "services" | "legacy" | "founder" | "logo";
  title: string;
  mode: SectionMode;
  dir: string; // folder under /images for newly uploaded files
  slotLabels?: string[];
  compress: { maxDimension: number; quality: number };
};

export const SECTIONS: SectionConfig[] = [
  { key: "hero", title: "Hero gallery", mode: "gallery", dir: "hero", compress: { maxDimension: 2400, quality: 0.82 } },
  { key: "events", title: "Events", mode: "gallery", dir: "events", compress: { maxDimension: 2000, quality: 0.82 } },
  {
    key: "services",
    title: "Services",
    mode: "slots",
    dir: "services",
    slotLabels: ["Theatre Arts", "Dance", "Annual Day & Corporate"],
    compress: { maxDimension: 2000, quality: 0.82 },
  },
  {
    key: "legacy",
    title: "Legacy timeline",
    mode: "slots",
    dir: "work_legacy",
    slotLabels: ["Corporate Productions", "School Productions", "Dance Performances"],
    compress: { maxDimension: 2000, quality: 0.82 },
  },
  { key: "founder", title: "Founder portrait", mode: "single", dir: "founder", compress: { maxDimension: 1400, quality: 0.85 } },
  { key: "logo", title: "Logo", mode: "single", dir: "founder", compress: { maxDimension: 800, quality: 0.95 } },
];
```

- [ ] **Step 2: The editor component**

Create `src/app/admin/Editor.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { siteImages, flattenPaths, deletedPaths, type SiteImages } from "@/content/manifest";
import { compressImage, hashBlob, blobToBase64 } from "@/lib/compressImage";
import { SECTIONS, type SectionConfig } from "./sections.config";

type Pending = Record<string, string>; // webPath -> base64

function clone(m: SiteImages): SiteImages {
  return JSON.parse(JSON.stringify(m));
}

export default function Editor({ onLogout }: { onLogout: () => void }) {
  const original = useMemo(() => siteImages, []);
  const [manifest, setManifest] = useState<SiteImages>(() => clone(siteImages));
  const [pending, setPending] = useState<Pending>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; msg: string; url?: string }>({
    kind: "idle",
    msg: "",
  });

  const srcFor = (path: string) => (pending[path] ? `data:image/webp;base64,${pending[path]}` : path);

  async function processFile(cfg: SectionConfig, file: File): Promise<string> {
    const blob = await compressImage(file, cfg.compress);
    const hash = await hashBlob(blob);
    const base64 = await blobToBase64(blob);
    const webPath = `/images/${cfg.dir}/${hash}.webp`;
    setPending((p) => ({ ...p, [webPath]: base64 }));
    return webPath;
  }

  async function addToGallery(cfg: SectionConfig, files: FileList) {
    setBusy(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) added.push(await processFile(cfg, file));
      setManifest((m) => ({ ...m, [cfg.key]: [...(m[cfg.key] as string[]), ...added] }));
    } finally {
      setBusy(false);
    }
  }

  function removeFromGallery(cfg: SectionConfig, path: string) {
    setManifest((m) => ({ ...m, [cfg.key]: (m[cfg.key] as string[]).filter((p) => p !== path) }));
  }

  async function replaceSlot(cfg: SectionConfig, index: number, file: File) {
    setBusy(true);
    try {
      const webPath = await processFile(cfg, file);
      setManifest((m) => {
        const arr = [...(m[cfg.key] as string[])];
        arr[index] = webPath;
        return { ...m, [cfg.key]: arr };
      });
    } finally {
      setBusy(false);
    }
  }

  async function replaceSingle(cfg: SectionConfig, file: File) {
    setBusy(true);
    try {
      const webPath = await processFile(cfg, file);
      setManifest((m) => ({ ...m, [cfg.key]: webPath }));
    } finally {
      setBusy(false);
    }
  }

  const dirty = JSON.stringify(manifest) !== JSON.stringify(original);

  async function publish() {
    setBusy(true);
    setStatus({ kind: "idle", msg: "Publishing…" });
    try {
      const referenced = new Set(flattenPaths(manifest));
      const newFiles = Object.entries(pending)
        .filter(([path]) => referenced.has(path))
        .map(([path, base64]) => ({ path, base64 }));
      const res = await fetch("/api/admin/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifest, newFiles, deletedPaths: deletedPaths(original, manifest) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setStatus({ kind: "ok", msg: "Committed — Vercel is deploying (~1–2 min).", url: data.commitUrl });
      setPending({});
    } catch (e) {
      setStatus({ kind: "error", msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-28">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2d1810]">Site images</h1>
        <button onClick={onLogout} className="text-sm text-[#8b3a3a] underline">
          Log out
        </button>
      </header>

      {SECTIONS.map((cfg) => (
        <section key={cfg.key} className="mb-10 rounded-2xl border border-[#e0d3c4] bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-[#2d1810]">{cfg.title}</h2>

          {cfg.mode === "gallery" && (
            <div className="flex flex-wrap gap-3">
              {(manifest[cfg.key] as string[]).map((path) => (
                <div key={path} className="relative h-28 w-28 overflow-hidden rounded-lg border">
                  <img src={srcFor(path)} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeFromGallery(cfg, path)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 px-2 text-xs text-white"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e07b39] text-sm text-[#e07b39]">
                ＋ Add
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addToGallery(cfg, e.target.files)}
                />
              </label>
            </div>
          )}

          {cfg.mode === "slots" && (
            <div className="flex flex-wrap gap-5">
              {(manifest[cfg.key] as string[]).map((path, i) => (
                <div key={i} className="w-40">
                  <div className="mb-1 text-xs font-medium text-[#4a3428]">{cfg.slotLabels?.[i]}</div>
                  <div className="relative h-28 w-40 overflow-hidden rounded-lg border">
                    <img src={srcFor(path)} alt="" className="h-full w-full object-cover" />
                  </div>
                  <label className="mt-2 block cursor-pointer text-center text-sm text-[#e07b39] underline">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && replaceSlot(cfg, i, e.target.files[0])}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          {cfg.mode === "single" && (
            <div className="w-40">
              <div className="relative h-28 w-40 overflow-hidden rounded-lg border bg-[#faf7f2]">
                <img src={srcFor(manifest[cfg.key] as string)} alt="" className="h-full w-full object-contain" />
              </div>
              <label className="mt-2 block cursor-pointer text-center text-sm text-[#e07b39] underline">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && replaceSingle(cfg, e.target.files[0])}
                />
              </label>
            </div>
          )}
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-[#e0d3c4] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="text-sm">
            {status.kind === "error" && <span className="text-red-600">{status.msg}</span>}
            {status.kind === "ok" && (
              <span className="text-green-700">
                {status.msg}{" "}
                {status.url && (
                  <a href={status.url} target="_blank" rel="noreferrer" className="underline">
                    view commit
                  </a>
                )}
              </span>
            )}
            {status.kind === "idle" && status.msg && <span className="text-[#4a3428]">{status.msg}</span>}
            {status.kind === "idle" && !status.msg && (
              <span className="text-[#4a3428]">{dirty ? "Unpublished changes" : "No changes"}</span>
            )}
          </div>
          <button
            onClick={publish}
            disabled={busy || !dirty}
            className="rounded-full bg-[#e07b39] px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {busy ? "Working…" : "Publish changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: The auth gate**

Create `src/app/admin/AdminApp.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Editor from "./Editor";

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      setAuthed(true);
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="grid min-h-screen place-items-center text-[#4a3428]">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#faf7f2] px-4">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[#e0d3c4] bg-white p-6">
          <h1 className="mb-4 text-xl font-bold text-[#2d1810]">Rangved Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-lg border border-[#e0d3c4] px-3 py-2"
            autoFocus
          />
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-full bg-[#e07b39] px-4 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            {busy ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Editor onLogout={logout} />
    </div>
  );
}
```

- [ ] **Step 4: The page (noindex)**

Create `src/app/admin/page.tsx`:

```tsx
import type { Metadata } from "next";
import AdminApp from "./AdminApp";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds; `/admin` is listed as a route.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin
git commit -m "feat: add admin asset manager UI"
```

---

## Task 9: End-to-end verification & deployment setup

**Files:**
- Modify: `README.md` (add an "Admin" section)

- [ ] **Step 1: Local full-flow test (against a throwaway branch)**

Ensure `.env.local` has all five vars. To avoid committing to `main` during testing, set `GITHUB_BRANCH=admin-test` and create that branch on the remote first: `git push origin main:admin-test`.

Run `npm run dev`, open `http://localhost:3000/admin`:
1. Wrong password → "Incorrect password".
2. Correct password → editor loads with current images.
3. In **Hero**: add a large (5 MB+) photo. Confirm it previews. Remove one existing image.
4. In **Services**: replace slot 1's image.
5. Click **Publish changes**.
Expected: success banner with a "view commit" link; opening it shows one commit on `admin-test` containing the updated `src/content/site-images.json`, the new `public/images/hero/<hash>.webp`, and the removed file deleted. Confirm the committed `.webp` is dramatically smaller than the original upload (visually identical).

- [ ] **Step 2: Confirm unauthorized commit is blocked**

Run: `curl -i -X POST localhost:3000/api/admin/commit -H "Content-Type: application/json" -d '{"manifest":{}}'`
Expected: `HTTP/1.1 401` `{"ok":false,"error":"Unauthorized"}` (no cookie sent).

- [ ] **Step 3: Confirm the token never reaches the browser**

Run: `npm run build` then search the client bundle:
`grep -r "github_pat" dist 2>/dev/null; grep -ri "GITHUB_TOKEN" dist/static 2>/dev/null`
Expected: no matches (the token is only read in Node route handlers).

- [ ] **Step 4: Clean up the test branch**

`git push origin --delete admin-test` and reset `GITHUB_BRANCH=main` in `.env.local`.

- [ ] **Step 5: Document the one-time Vercel/GitHub setup**

Add to `README.md` an "Admin" section:

```markdown
## Admin (/admin)

The owner can manage site images at `/admin`. Set these environment variables in
Vercel (Project → Settings → Environment Variables) and locally in `.env.local`:

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | the login password |
| `ADMIN_SESSION_SECRET` | any long random string |
| `GITHUB_TOKEN` | fine-grained PAT with **Contents: Read and write** on `Rakeshkoyya/rangved_website` |
| `GITHUB_REPO` | `Rakeshkoyya/rangved_website` |
| `GITHUB_BRANCH` | `main` |

Publishing writes one commit to `GITHUB_BRANCH`, which triggers Vercel's
auto-deploy. Image edits go live ~1–2 minutes later.
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: document admin env setup"
```

---

## Known limitations (v1, by design)

- The admin reads the **deployed** manifest. If you publish twice before the first
  deploy finishes, the second publish computes deletions from the stale manifest;
  for a single owner editing occasionally this is fine. (A future version could
  fetch the live manifest from GitHub before committing.)
- All new files for one publish are sent in a single request; client-side WebP
  compression keeps this well under Vercel's ~4.5 MB body limit for normal use.
- Services/Legacy **text** stays in code; only their 3 images are editable.

## Self-review notes

- **Spec coverage:** secure server commit (Tasks 1,5,6), env-var password server-checked (Tasks 4,5), manifest single-source + no visual change (Tasks 2,3), gallery vs 3-slot vs single UI (Task 8), client WebP compression (Task 7), atomic GitHub commit (Task 6), noindex/robots (Tasks 1,8), env setup docs (Task 9). All covered.
- **Symbol consistency:** `SESSION_COOKIE`, `signSession`, `verifySession`, `checkPassword`, `SESSION_MAX_AGE_SECONDS` (Task 4) ↔ used in Task 5; `siteImages`, `validateManifest`, `flattenPaths`, `deletedPaths`, `SiteImages` (Task 2) ↔ Tasks 3,6,8; `commitChanges`, `CommitFile`, `webPathToRepoPath`, `buildDeletionEntries` (Task 6); `compressImage`, `hashBlob`, `blobToBase64` (Task 7) ↔ Task 8; `SECTIONS`, `SectionConfig` (Task 8). Consistent.
- **No placeholders:** every code step contains complete code.
