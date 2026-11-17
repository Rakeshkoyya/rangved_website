import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { siteImages } from "@/content/manifest";
import { getCategory } from "@/content/work";
import PhotoGallery from "./PhotoGallery";

// Categories come from site-images.json; an admin publish redeploys, regenerating these pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return siteImages.workCategories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata(props: PageProps<"/our-work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(siteImages.workCategories, slug);
  if (!category) return {};
  return {
    title: `${category.title} — Our Work`,
    description: category.description,
    alternates: { canonical: `/our-work/${category.id}` },
    openGraph: category.images[0] ? { images: [{ url: category.images[0], alt: category.title }] } : undefined,
  };
}

export default async function CategoryGalleryPage(props: PageProps<"/our-work/[slug]">) {
  const { slug } = await props.params;
  const categories = siteImages.workCategories;
  const category = getCategory(categories, slug);
  if (!category) notFound();

  const index = categories.findIndex((c) => c.id === category.id);
  const next = categories[(index + 1) % categories.length];
  const count = category.images.length;

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pt-28 md:px-12 md:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#4a3428]/80">
          <Link href="/our-work" className="py-1 font-medium text-[#c06020] hover:underline">
            Our Work
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span aria-current="page">{category.title}</span>
        </nav>

        <div className="mt-3 grid gap-4 md:grid-cols-12 md:items-end md:gap-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-[#2d1810] md:col-span-6 md:text-6xl">
            {category.title}
          </h1>
          <div className="md:col-span-6">
            <p className="text-base leading-relaxed text-[#4a3428]">{category.description}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c06020]">
              {count} {count === 1 ? "photo" : "photos"}
            </p>
          </div>
        </div>

        <div className="mt-8 border-b border-[#2d1810]/10" />
      </header>

      <section aria-label={`${category.title} photos`} className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-10">
        <PhotoGallery images={category.images} title={category.title} />

        {categories.length > 1 && (
          <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#2d1810] p-8 md:flex-row md:items-center md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e09570]">Up next</p>
              <p className="mt-2 font-[family-name:var(--font-playfair)] text-3xl font-bold text-white">{next.title}</p>
            </div>
            <Link
              href={`/our-work/${next.id}`}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e07b39] to-[#f0a060] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              View gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
