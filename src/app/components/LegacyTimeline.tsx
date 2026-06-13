"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Production = {
  title: string;
  year: string;
  venue: string;
};

type Category = {
  id: string;
  label: string;
  heading: string;
  blurb: string;
  image: string;
  imageAlt: string;
  productions?: Production[];
  styles?: string[];
};

const categories: Category[] = [
  {
    id: "corporate",
    label: "Corporate Productions",
    heading: "Corporate Productions",
    blurb:
      "Original stage productions brought to life with professional ensembles and immersive storytelling.",
    image: "/images/work_legacy/6.jpg",
    imageAlt: "Corporate production performance",
    productions: [
      { title: "Mirror Mirror", year: "2023", venue: "The Exyte Company" },
      {
        title: "The Emperor's New Hair",
        year: "2023",
        venue: "Walker Town Academy, Secunderabad",
      },
    ],
  },
  {
    id: "school",
    label: "School Productions",
    heading: "School Productions",
    blurb:
      "Large-scale school productions that put hundreds of young performers centre stage.",
    image: "/images/work_legacy/4.JPG",
    imageAlt: "School production performance",
    productions: [
      {
        title: "Life of Alluri Seetharamaraju",
        year: "2024",
        venue: "Gitanjali Vedika School",
      },
      { title: "Mai Hu Tiranga", year: "2024", venue: "Gitanjali Primary School" },
      {
        title: "Hazaaron Salaam Mere Desh ke liye",
        year: "2025",
        venue: "Gitanjali Vedika School",
      },
      {
        title: "Ghar Ghar ki Kahani",
        year: "2025",
        venue: "Alumni event, Gitanjali Group of Schools",
      },
      { title: "Naari Shakti", year: "2025", venue: "Gitanjali Primary School" },
      {
        title: "Street Play & Mime on Superstition",
        year: "2026",
        venue: "St. Joseph High School",
      },
    ],
  },
  {
    id: "dance",
    label: "Dance Performances",
    heading: "Dance Performances",
    blurb:
      "From classical traditions to contemporary moves — choreography across every style.",
    image: "/images/work_legacy/5.jpeg",
    imageAlt: "Dance performance",
    styles: ["Classical", "Western", "Folk", "Hip-Hop", "Garba", "Zumba"],
  },
];

const listContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function LegacyTimeline() {
  const [active, setActive] = useState(0);
  const category = categories[active];
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  // Auto-scroll the active pill into view on mobile
  useEffect(() => {
    const container = tabsScrollRef.current;
    const btn = tabButtonRefs.current[active];
    if (!container || !btn) return;
    // Directly set scrollLeft so only the tab strip scrolls, never the window
    const containerCenter = container.offsetWidth / 2;
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
    container.scrollLeft = btnCenter - containerCenter;
  }, [active]);

  // Reset expanded venue whenever the category changes
  useEffect(() => {
    setExpandedVenue(null);
  }, [active]);

  // Collapse when clicking anywhere outside
  useEffect(() => {
    if (!expandedVenue) return;
    const handler = () => setExpandedVenue(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [expandedVenue]);

  return (
    <section
      id="legacy"
      className="relative overflow-hidden bg-[#1a1410] py-16 md:py-32"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#2d1810] to-[#1a1410]" />
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-10 left-10 h-96 w-96 animate-pulse rounded-full bg-[#e07b39] blur-3xl" />
        <div
          className="absolute -bottom-10 right-10 h-96 w-96 animate-pulse rounded-full bg-[#d4a853] blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#e07b39]">
            Our Work
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-5xl font-bold text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-[#e07b39] via-[#d4a853] to-[#e09570]">
            Our Legacy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#f5e6d3]/70 md:text-xl">
            A showcase of the productions and performances that define our craft.
          </p>
        </motion.div>

        {/* Tabs — horizontal scroll strip on mobile, centered wrap on md+ */}
        <div className="relative mb-12">
          <div
            ref={tabsScrollRef}
            className="scrollbar-hide flex gap-2 overflow-x-auto px-6 pb-1 md:flex-wrap md:items-center md:justify-center md:gap-3 md:overflow-visible md:px-0 md:pb-0"
          >
            {categories.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  ref={(el) => { tabButtonRefs.current[i] = el; }}
                  key={c.id}
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer md:px-6 md:py-3 md:text-base ${
                    isActive
                      ? "bg-gradient-to-r from-[#e07b39] to-[#d4a853] text-[#1a1410] shadow-[0_0_30px_rgba(224,123,57,0.4)]"
                      : "border border-[#f5e6d3]/15 bg-white/5 text-[#f5e6d3]/80 hover:border-[#e07b39]/50 hover:text-[#f5e6d3]"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* Feature photo */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              {/* Decorative blobs — hidden on mobile to prevent horizontal overflow */}
              <div className="hidden md:block absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#e07b39] opacity-40 blur-2xl" />
              <div className="hidden md:block absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#d4a853] opacity-30 blur-2xl" />
            </div>

            {/* List side */}
            <div className="min-w-0">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#f5e6d3] md:text-4xl">
                {category.heading}
              </h3>
              <p className="mt-3 max-w-xl text-[#f5e6d3]/65">{category.blurb}</p>

              {category.productions && (
                <motion.ul
                  variants={listContainer}
                  initial="hidden"
                  animate="show"
                  className="mt-8 divide-y divide-[#f5e6d3]/10"
                >
                  {category.productions.map((p) => (
                    <motion.li
                      key={p.title}
                      variants={listItem}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedVenue(
                              expandedVenue === `${category.id}-${p.title}`
                                ? null
                                : `${category.id}-${p.title}`
                            );
                          }}
                          className={`text-lg font-semibold text-[#f5e6d3] cursor-pointer select-none transition-all duration-300 md:text-xl ${
                            expandedVenue === `${category.id}-${p.title}`
                              ? "whitespace-normal"
                              : "truncate"
                          }`}
                        >
                          {p.title}
                        </p>
                        <p
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedVenue(
                              expandedVenue === `${category.id}-${p.title}`
                                ? null
                                : `${category.id}-${p.title}`
                            );
                          }}
                          className={`mt-0.5 text-sm text-[#f5e6d3]/55 cursor-pointer select-none transition-all duration-300 ${
                            expandedVenue === `${category.id}-${p.title}`
                              ? "whitespace-normal"
                              : "truncate"
                          }`}
                        >
                          {p.venue}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-[#e07b39] to-[#d4a853] px-3 py-1 text-sm font-bold text-[#1a1410]">
                        {p.year}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {category.styles && (
                <motion.div
                  variants={listContainer}
                  initial="hidden"
                  animate="show"
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {category.styles.map((style) => (
                    <motion.span
                      key={style}
                      variants={listItem}
                      className="rounded-full border border-[#e07b39]/30 bg-white/5 px-5 py-2.5 text-base font-medium text-[#f5e6d3] transition-colors duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-[#e07b39] hover:to-[#d4a853] hover:text-[#1a1410]"
                    >
                      {style}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
