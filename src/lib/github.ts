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
