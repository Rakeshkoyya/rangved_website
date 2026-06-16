import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { commitChanges, type CommitFile } from "@/lib/github";
import { validateManifest } from "@/content/manifest";

export const runtime = "nodejs";

/**
 * Commits made via the GitHub API don't reliably fire Vercel's push-webhook,
 * so we explicitly kick a deploy with a Vercel Deploy Hook when one is set.
 * Returns true if a deploy was triggered, false if no hook is configured or it failed.
 */
async function triggerDeploy(): Promise<boolean> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL || "";
  if (!hook) return false;
  try {
    const res = await fetch(hook, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

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
    const deployTriggered = await triggerDeploy();
    return NextResponse.json({ ok: true, commitUrl, deployTriggered });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
