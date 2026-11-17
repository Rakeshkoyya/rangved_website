"use client";

import { useState } from "react";
import type { WorkCategory } from "@/content/manifest";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, uniqueId } from "@/content/work";

type Update = (fn: (prev: WorkCategory[]) => WorkCategory[]) => void;

type Props = {
  categories: WorkCategory[];
  update: Update;
  upload: (categoryId: string, files: FileList) => Promise<string[]>;
  srcFor: (path: string) => string;
};

const patch = (list: WorkCategory[], id: string, change: Partial<WorkCategory>) =>
  list.map((c) => (c.id === id ? { ...c, ...change } : c));

const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const btn = "rounded-md border border-[#e0d3c4] px-2 py-1 text-xs text-[#4a3428] hover:border-[#e07b39] disabled:opacity-30";

export default function WorkCategoriesEditor({ categories, update, upload, srcFor }: Props) {
  const [newTitle, setNewTitle] = useState("");
  const [drag, setDrag] = useState<{ id: string; index: number } | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addCategory() {
    const title = newTitle.trim();
    if (!title) return;
    update((prev) => [
      ...prev,
      { id: uniqueId(title, prev.map((c) => c.id)), title, description: "", images: [] },
    ]);
    setNewTitle("");
  }

  function removeCategory(cat: WorkCategory) {
    if (!window.confirm(`Delete "${cat.title}" and its ${cat.images.length} photo(s) from the site?`)) return;
    update((prev) => prev.filter((c) => c.id !== cat.id));
  }

  async function addPhotos(id: string, files: FileList) {
    setUploadingId(id);
    try {
      const added = await upload(id, files);
      update((prev) => prev.map((c) => (c.id === id ? { ...c, images: [...c.images, ...added] } : c)));
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#8a7a6a]">
        Each category appears as a slide in the home-page Events carousel (first 3 photos) and as a gallery on the
        Our Work page. The first photo is the cover — drag photos to reorder.
      </p>

      {categories.map((cat, ci) => (
        <div key={cat.id} className="rounded-xl border border-[#e0d3c4] bg-[#fdfbf8] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8a7a6a]">{String(ci + 1).padStart(2, "0")}</span>
            <input
              value={cat.title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => update((prev) => patch(prev, cat.id, { title: e.target.value }))}
              className="min-w-0 flex-1 rounded-lg border border-[#e0d3c4] px-3 py-1.5 font-semibold text-[#2d1810]"
              aria-label="Category title"
            />
            <button className={btn} disabled={ci === 0} onClick={() => update((p) => move(p, ci, ci - 1))} aria-label="Move up">
              ↑
            </button>
            <button
              className={btn}
              disabled={ci === categories.length - 1}
              onClick={() => update((p) => move(p, ci, ci + 1))}
              aria-label="Move down"
            >
              ↓
            </button>
            <button className={`${btn} text-[#8b3a3a]`} onClick={() => removeCategory(cat)}>
              Delete
            </button>
          </div>

          <textarea
            value={cat.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={3}
            onChange={(e) => update((prev) => patch(prev, cat.id, { description: e.target.value }))}
            placeholder="Short description shown on the carousel slide and gallery page"
            className="mb-1 w-full rounded-lg border border-[#e0d3c4] px-3 py-2 text-sm text-[#4a3428]"
            aria-label="Category description"
          />
          <p className="mb-3 text-right text-[10px] text-[#8a7a6a]">
            {cat.description.length}/{MAX_DESCRIPTION_LENGTH} · link: /our-work/{cat.id}
          </p>

          <div className="flex flex-wrap gap-3">
            {cat.images.map((path, index) => (
              <div
                key={`${path}-${index}`}
                draggable
                onDragStart={() => setDrag({ id: cat.id, index })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (drag && drag.id === cat.id) {
                    update((prev) => prev.map((c) => (c.id === cat.id ? { ...c, images: move(c.images, drag.index, index) } : c)));
                  }
                  setDrag(null);
                }}
                onDragEnd={() => setDrag(null)}
                className={`relative h-24 w-24 cursor-move overflow-hidden rounded-lg border ${
                  drag?.id === cat.id && drag.index === index ? "opacity-40" : ""
                }`}
              >
                <img src={srcFor(path)} alt="" draggable={false} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-[#e07b39] px-1.5 text-[10px] font-semibold text-white">
                    Cover
                  </span>
                )}
                <button
                  onClick={() =>
                    update((prev) =>
                      prev.map((c) => (c.id === cat.id ? { ...c, images: c.images.filter((_, i) => i !== index) } : c))
                    )
                  }
                  className="absolute right-1 top-1 rounded-full bg-black/70 px-2 text-xs text-white"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#e07b39] text-center text-sm text-[#e07b39]">
              {uploadingId === cat.id ? "Adding…" : "＋ Add photos"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingId !== null}
                onChange={(e) => {
                  if (e.target.files?.length) addPhotos(cat.id, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      ))}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <input
          value={newTitle}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New category, e.g. Birthday Parties"
          className="flex-1 rounded-lg border border-[#e0d3c4] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="rounded-full bg-[#2d1810] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Add category
        </button>
      </form>
    </div>
  );
}
