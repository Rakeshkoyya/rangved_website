This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Admin (/admin)

The owner can manage site images at `/admin` (Hero gallery, Events, Services,
Legacy timeline, Founder portrait, Logo). Editing stages changes in the browser;
clicking **Publish changes** writes one commit to GitHub, which triggers Vercel's
auto-deploy. Uploaded images are compressed to visually-lossless WebP before upload.

All section image paths live in a single source of truth: `src/content/site-images.json`.

Set these environment variables in Vercel (Project → Settings → Environment
Variables) and locally in `.env.local` (see `.env.example`):

| Variable | Value |
| --- | --- |
| `ADMIN_PASSWORD` | the login password (checked server-side) |
| `ADMIN_SESSION_SECRET` | any long random string (signs the session cookie) |
| `GITHUB_TOKEN` | fine-grained PAT with **Contents: Read and write** on `Rakeshkoyya/rangved_website` |
| `GITHUB_REPO` | `Rakeshkoyya/rangved_website` |
| `GITHUB_BRANCH` | `main` |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel Deploy Hook for `main` (see below) — recommended |

Image edits go live ~1–2 minutes after publishing (once Vercel finishes deploying).

### Why the Deploy Hook is needed

The admin publishes by creating a commit through the **GitHub API**. Commits made
this way don't reliably trigger Vercel's push-webhook, so the new commit can land
on `main` without starting a deploy. To fix this, create a **Deploy Hook** in Vercel
(Project → Settings → Git → **Deploy Hooks**, branch `main`), copy its URL into the
`VERCEL_DEPLOY_HOOK_URL` env var, and the admin will ping it after each publish to
trigger the build. If the variable is unset, the commit still lands — you'd just
have to redeploy manually from the Vercel dashboard.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
