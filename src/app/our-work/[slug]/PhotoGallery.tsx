"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = { images: string[]; title: string };

/** Masonry grid of photos; clicking one opens a full-screen lightbox. */
export default function PhotoGallery({ images, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = images.length;
  const isOpen = openIndex !== null;

  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + total) % total));

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % total));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, total]);

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e07b39]/40 bg-white/60 px-6 py-20 text-center text-[#4a3428]/70">
        Photos from our {title.toLowerCase()} are coming soon.
      </div>
    );
  }

  return (
    <>
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((src, index) => (
          <li key={`${src}-${index}`} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-[#e8d5c4] shadow-[0_10px_30px_-15px_rgba(45,24,16,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e07b39]"
              aria-label={`Open photo ${index + 1} of ${total}`}
            >
              <Image
                src={src}
                alt={`${title} — photo ${index + 1}`}
                width={1200}
                height={900}
                priority={index < 3}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-[#2d1810]/0 transition-colors duration-300 group-hover:bg-[#2d1810]/20" />
            </button>
          </li>
        ))}
      </ul>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo viewer`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[openIndex]}
              alt={`${title} — photo ${openIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#e07b39]"
            aria-label="Close photo viewer"
            autoFocus
          >
            <X className="h-6 w-6" />
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#e07b39] md:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-[#e07b39] md:right-6"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {openIndex + 1} / {total}
          </p>
        </div>
      )}
    </>
  );
}
