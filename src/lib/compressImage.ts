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
