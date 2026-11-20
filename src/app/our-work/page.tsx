import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteImages } from "@/content/manifest";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Photo galleries of weddings, corporate events, school events, community gatherings, housewarming and baby shower ceremonies organised by Rangved in Hyderabad.",
  alternates: { canonical: "/our-work" },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Mosaic rhythm, repeating every 8 tiles on the 4-column grid:
 * one feature tile (2x2), four singles, one wide tile, two singles.
 * grid-flow-dense back-fills any gaps when the category count isn't a multiple of 8.
 */
const TILE_PATTERN = ["sm:col-span-2 lg:row-span-2", "", "", "", "", "lg:col-span-2", "", ""];

export default function OurWorkPage() {
  const categories = siteImages.workCategories;
  const photoCount = categories.reduce((sum, c) => sum + c.images.length, 0);

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pb-10 pt-28 md:px-12 md:pb-14 md:pt-36">
        <div className="grid items-end gap-6 border-b border-[#2d1810]/10 pb-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c06020]">Portfolio</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-6xl font-bold leading-[0.95] text-[#2d1810] md:text-8xl">
              Our{" "}
              <span className="bg-gradient-to-r from-[#e07b39] to-[#d4a853] bg-clip-text italic text-transparent">
                Work
              </span>
            </h1>
          </div>
          <div className="md:col-span-5">
            <p className="text-base leading-relaxed text-[#4a3428] md:text-lg">
              Pick an event to step into its gallery.
            </p>
            <p className="mt-4 flex gap-6 text-sm text-[#4a3428]/80">
              <span>
                <strong className="font-[family-name:var(--font-playfair)] text-2xl text-[#2d1810]">
                  {pad(categories.length)}
                </strong>{" "}
                event types
              </span>
              <span>
                <strong className="font-[family-name:var(--font-playfair)] text-2xl text-[#2d1810]">{photoCount}</strong>{" "}
                photos
              </span>
            </p>
          </div>
        </div>
      </header>

      <section aria-label="Event categories" className="mx-auto max-w-7xl px-6 pb-20 md:px-12 md:pb-28">
        {categories.length === 0 ? (
          <p className="py-20 text-center text-[#4a3428]/70">Galleries are coming soon.</p>
        ) : (
          <ul className="grid auto-rows-[280px] grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4">
            {categories.map((cat, index) => {
              const span = TILE_PATTERN[index % TILE_PATTERN.length];
              const isFeature = index % TILE_PATTERN.length === 0;
              const cover = cat.images[0];
              const count = cat.images.length;
              return (
                <li key={cat.id} className={span}>
                  <Link
                    href={`/our-work/${cat.id}`}
                    className="group relative block h-full overflow-hidden rounded-2xl bg-[#e8d5c4] outline-none ring-[#e07b39] ring-offset-4 ring-offset-[#faf7f2] focus-visible:ring-2"
                  >
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        priority={index < 4}
                        sizes={isFeature ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#f0a060] to-[#c97856]" />
                    )}
                    {/* Shade only the bottom for legible titles; the photo stays bright. */}
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2d1810] shadow-sm">
                      {pad(index + 1)}
                    </span>
                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#2d1810] shadow-sm transition-[transform,background-color,color] duration-300 group-hover:rotate-45 motion-reduce:group-hover:rotate-0 group-hover:bg-[#e07b39] group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h2
                        className={`font-[family-name:var(--font-playfair)] font-bold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] ${
                          isFeature ? "text-3xl md:text-4xl" : "text-2xl"
                        }`}
                      >
                        {cat.title}
                      </h2>
                      {isFeature && (
                        <p className="mt-2 hidden max-w-md text-sm leading-relaxed text-white/85 md:line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c9a8]">
                        {count} {count === 1 ? "photo" : "photos"}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
