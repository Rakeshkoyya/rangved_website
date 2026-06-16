# Admin Asset Manager — Design Spec

**Date:** 2026-06-16
**Status:** Approved
**Repo:** `Rakeshkoyya/rangved_website` (branch `main`), deployed on Vercel
**Stack:** Next.js 16.2.4, React 19, Tailwind 3

## 1. Purpose

Give the site owner a private `/admin` page to manage the website's image assets
(hero gallery, events, services, legacy timeline, founder portrait, logo) without
touching code. The owner logs in with a single password, adds/removes/replaces
images per section, and clicks **Publish** — which commits the changes to GitHub
in one atomic commit, triggering Vercel's auto-deploy.

Uploaded images are automatically compressed to **visually-lossless** quality in
the browser so the live site stays fast.

## 2. Key constraint that drove the architecture

The site is currently a **static export** (`output: "export"`) — no server runtime.
A GitHub write token can never be placed in client-side code (it ships to every
visitor's browser). Therefore the commit must happen on a **server endpoint** where
the token stays secret.

**Decision (approved):** Drop pure static-export so we gain server route handlers.
The public marketing pages remain pre-rendered (SSG) and just as fast — we only add
two server endpoints. `images.unoptimized: true` is kept so live rendering is
unchanged.

## 3. Architecture overview

```
Browser (/admin, client)                 Server (Vercel functions)            GitHub
─────────────────────────                ──────────────────────────          ──────
[ Password screen ] ──POST password────▶ /api/admin/login
                     ◀──Set-Cookie──────  verify vs ADMIN_PASSWORD env
                        (HttpOnly,         sign HMAC session cookie
                         signed)           (ADMIN_SESSION_SECRET)

[ Asset editor ]
  - load current state from
    src/content/site-images.json
  - stage add/remove/replace
  - compress uploads (WebP)
                     ──POST {manifest,
                        newFiles[],
                        deletedPaths[]}──▶ /api/admin/commit
                                           validate session cookie
                                           build ONE git commit ──────────▶ commit on main
                                           via GitHub Git Data API           (Vercel auto-deploys)
                     ◀──{ commitUrl }──────
[ "Deploying ~1-2 min" ]
```

### Config change
- Remove `output: "export"` from `next.config.ts`. Keep `images.unoptimized: true`.
- `distDir` may stay or revert to default (`.next`); not load-bearing.

## 4. Single source of truth for images

Create `src/content/site-images.json` holding **only the editable image paths**:

```jsonc
{
  "hero":     ["/images/hero/1.JPG", "/images/hero/2.JPG", ...], // dynamic list
  "events":   ["/images/events/1.jpeg", ...],                    // dynamic list
  "services": ["/images/services/1.jpeg",                        // EXACTLY 3 slots
               "/images/services/2.png",
               "/images/services/5.PNG"],
  "legacy":   ["/images/work_legacy/6.jpg",                      // EXACTLY 3 slots
               "/images/work_legacy/4.JPG",
               "/images/work_legacy/5.jpeg"],
  "founder":  "/images/founder/founder.jpg",                     // single
  "logo":     "/images/founder/rangved.png"                      // single
}
```

### Component refactor (no visual change to the live site)
Components stop hardcoding image arrays and import from the manifest instead:

| Section | Component(s) | Edit mode | Notes |
|---|---|---|---|
| Hero gallery | `Hero.tsx` | dynamic list | Also feeds `ContactNew.tsx` background and SEO `og:image` (first item) in `layout.tsx` |
| Events | `Events.tsx` | dynamic list | |
| Services | `ServicesNew.tsx` | 3 fixed slots | Component keeps title/description **in code**, pulls image by slot index |
| Legacy timeline | `LegacyTimeline.tsx` | 3 fixed slots | Component keeps year/title/text **in code**, pulls image by slot index |
| Founder portrait | `FounderNew.tsx` | single | |
| Logo | `Navigation.tsx`, `FooterNew.tsx`, `Hero.tsx` badge, favicon/SEO in `layout.tsx` | single | All read the one `logo` value |

`ContactNew.tsx` currently duplicates the hero array — it will import the shared
`hero` list so editing hero updates it automatically. `layout.tsx` SEO `og:image`
uses the first hero image and the `logo` value from the manifest.

## 5. Admin UI (`/admin`)

- **Logged out:** centered password form. Wrong password → inline error.
- **Logged in:** vertical list of section editors:
  - **Hero**, **Events** — responsive grid of current images; each thumbnail has a
    ✕ remove control; a trailing "＋ Add images" tile opens a multi-file picker.
  - **Services**, **Legacy** — exactly **3 labelled slots**; each slot shows the
    current image with a "Replace" control only (no add/remove).
  - **Founder**, **Logo** — single "Replace image" tile.
- All edits are **staged in the browser** with live preview (object URLs); nothing
  is sent until publish.
- A sticky footer shows a change summary and a **"Publish changes"** button.
  On click → compress any new files → `POST /api/admin/commit` → success state
  "Committed ✓ — Vercel is deploying (~1–2 min)" with a link to the commit.
- A "Log out" control clears the session cookie.

## 6. Image compression (client-side, before upload)

Goal: **visually lossless**, not byte-lossless (true lossless barely shrinks photos).

- Resize to max **2000px** on the long edge.
- Re-encode photos as **WebP at quality ≈ 0.82** → typical 5–10 MB phone photos
  become ~300–800 KB with no visible loss.
- Images **with transparency** (e.g. logo) keep **PNG** (alpha preserved).
- Output filename uses a **content hash**, e.g. `/images/hero/a1b2c3d4.webp`, for
  clean cache-busting and to avoid overwriting existing files.
- Implementation: Canvas/`createImageBitmap` re-encode (respecting EXIF
  orientation). A small library (e.g. `browser-image-compression`) is acceptable if
  it simplifies orientation handling; prefer minimal/no new deps if straightforward.
- Compressing client-side also keeps each `/api/admin/commit` request under
  Vercel's ~4.5 MB body limit.

## 7. The commit endpoint (`/api/admin/commit`)

1. Validate the signed session cookie (reject 401 otherwise).
2. Receive `{ manifest, newFiles: [{ path, base64 }], deletedPaths: [] }`.
3. Build **one atomic commit** on `GITHUB_BRANCH` using the GitHub **Git Data API**
   (plain `fetch`, no heavy deps):
   - get current ref + base tree,
   - create blobs for the new image files and the updated `site-images.json`,
   - create a tree that adds new blobs and omits (`sha: null`) deleted paths,
   - create a commit, update the ref.
4. Return `{ commitUrl }`. Vercel detects the push and auto-deploys.

### Environment variables (set in Vercel)
| Var | Purpose |
|---|---|
| `ADMIN_PASSWORD` | the login password, checked server-side |
| `ADMIN_SESSION_SECRET` | HMAC secret for signing the session cookie |
| `GITHUB_TOKEN` | fine-grained PAT with `contents: read/write` on the repo |
| `GITHUB_REPO` | `Rakeshkoyya/rangved_website` |
| `GITHUB_BRANCH` | `main` |

For local dev these go in `.env.local` (already git-ignored).

## 8. Security model

- The password gate is enforced **server-side** in both endpoints — not just the UI.
- Session is an **HttpOnly, signed, Secure** cookie (HMAC with `ADMIN_SESSION_SECRET`),
  so it can't be read or forged by client JS.
- The GitHub token never leaves the server.
- `/admin` and `/api/*` are `noindex` + disallowed in `robots`.
- Honest note: this is single-password protection appropriate for a one-owner
  marketing site, not multi-user auth.

## 9. Out of scope (v1 — YAGNI)

- WorkShowcase YouTube videos (not images).
- Drag-to-reorder images (order = list order; changes via add/remove).
- Editing Services/Legacy **text** through the UI (stays in code).
- Multi-user accounts / roles.

## 10. Acceptance criteria

1. Visiting `/admin` shows a password screen; correct password (matching env var)
   logs in, wrong password is rejected.
2. Hero and Events sections allow add (multi-upload), remove, and show live preview.
3. Services and Legacy each show exactly 3 replace-only slots with their labels.
4. Founder and Logo each allow single-image replace.
5. Uploaded images are compressed to WebP (PNG when transparent), max 2000px,
   visibly identical, and dramatically smaller.
6. "Publish changes" creates exactly one GitHub commit containing the updated
   `site-images.json`, added image files, and removed files; returns a commit link.
7. After deploy, the live site reflects the changes; **no visual regression** for
   unchanged assets.
8. The GitHub token is never present in any client bundle.
