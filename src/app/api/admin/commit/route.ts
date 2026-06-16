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
