"use client";

import { useState } from "react";
import { siteImages, flattenPaths, deletedPaths, summarizeChanges, type SiteImages } from "@/content/manifest";
import { compressImage, hashBlob, blobToBase64 } from "@/lib/compressImage";
import { SECTIONS, type SectionConfig } from "./sections.config";
import PublishProgress, { PUBLISH_STEPS, type PublishPhase } from "./PublishProgress";

type Pending = Record<string, string>; // webPath -> base64

function clone(m: SiteImages): SiteImages {
  return JSON.parse(JSON.stringify(m));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Editor({ onLogout }: { onLogout: () => void }) {
  const [original, setOriginal] = useState<SiteImages>(() => clone(siteImages));
  const [manifest, setManifest] = useState<SiteImages>(() => clone(siteImages));
  const [pending, setPending] = useState<Pending>({});
  const [busy, setBusy] = useState(false);

  const [drag, setDrag] = useState<{ key: string; index: number } | null>(null);

  const [publishPhase, setPublishPhase] = useState<PublishPhase>("idle");
  const [publishStep, setPublishStep] = useState(0);
  const [commitUrl, setCommitUrl] = useState<string | undefined>();
  const [publishError, setPublishError] = useState<string | undefined>();

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

  function reorderGallery(cfg: SectionConfig, from: number, to: number) {
    if (from === to) return;
    setManifest((m) => {
      const arr = [...(m[cfg.key] as string[])];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...m, [cfg.key]: arr };
    });
  }

  const dirty = JSON.stringify(manifest) !== JSON.stringify(original);

  async function publish() {
    setPublishError(undefined);
    setCommitUrl(undefined);
    setPublishStep(0);
    setPublishPhase("running");

    // Advance the cosmetic step animation on a timer, capped at the last step
    // until the real request resolves.
    let step = 0;
    const timer = setInterval(() => {
      step = Math.min(step + 1, PUBLISH_STEPS.length - 1);
      setPublishStep(step);
    }, 1100);

    try {
      const referenced = new Set(flattenPaths(manifest));
      const newFiles = Object.entries(pending)
        .filter(([path]) => referenced.has(path))
        .map(([path, base64]) => ({ path, base64 }));

      const request = fetch("/api/admin/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manifest,
          newFiles,
          deletedPaths: deletedPaths(original, manifest),
          summary: summarizeChanges(original, manifest),
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data as { commitUrl?: string };
      });

      // Keep the animation visible for at least a moment, even if the API is fast.
      const [data] = await Promise.all([request, sleep(2200)]);

      clearInterval(timer);
      setPublishStep(PUBLISH_STEPS.length); // mark all steps done
      setCommitUrl(data.commitUrl);
      setOriginal(clone(manifest)); // new baseline so the editor is no longer "dirty"
      setPending({});
      setPublishPhase("done");
    } catch (e) {
      clearInterval(timer);
      setPublishError((e as Error).message);
      setPublishPhase("error");
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
            <>
              <p className="mb-2 text-xs text-[#8a7a6a]">
                Drag images to reorder — the site shows them in this order.
              </p>
              <div className="flex flex-wrap gap-3">
                {(manifest[cfg.key] as string[]).map((path, index) => (
                  <div
                    key={path}
                    draggable
                    onDragStart={() => setDrag({ key: cfg.key, index })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (drag && drag.key === cfg.key) reorderGallery(cfg, drag.index, index);
                      setDrag(null);
                    }}
                    onDragEnd={() => setDrag(null)}
                    className={`relative h-28 w-28 cursor-move overflow-hidden rounded-lg border transition-opacity ${
                      drag && drag.key === cfg.key && drag.index === index ? "opacity-40" : ""
                    }`}
                  >
                    <img src={srcFor(path)} alt="" draggable={false} className="h-full w-full object-cover" />
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
            </>
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
          <span className="text-sm text-[#4a3428]">
            {dirty ? "You have unpublished changes" : "No changes"}
          </span>
          <button
            onClick={publish}
            disabled={busy || !dirty || publishPhase === "running"}
            className="rounded-full bg-[#e07b39] px-6 py-2.5 font-semibold text-white disabled:opacity-40"
          >
            Publish changes
          </button>
        </div>
      </div>

      <PublishProgress
        phase={publishPhase}
        stepIndex={publishStep}
        commitUrl={commitUrl}
        error={publishError}
        onClose={() => setPublishPhase("idle")}
      />
    </div>
  );
}
