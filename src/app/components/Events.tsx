"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { siteImages } from "@/content/manifest";
import { useHorizontalWheel } from "../hooks/useHorizontalWheel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = siteImages.workCategories;
const AUTOPLAY_MS = 6000;
const COLLAGE_SIZE = 3;
/** Each slide is narrower than the stage so the next one peeks in from the right. */
const SLIDE_WIDTH = "88%";
const SLIDE_GAP_PX = 20;
/** Lines the first slide up with the page content while slides still run to the screen edge. */
const EDGE_PADDING = "max(var(--gutter), calc((100% - 80rem) / 2 + var(--gutter)))";

const pad = (n: number) => String(n).padStart(2, "0");
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CollageProps = { images: string[]; title: string; isPriority: boolean };

/** One large photo plus up to two supporting ones; collapses gracefully with fewer photos. */
function SlideCollage({ images, title, isPriority }: CollageProps) {
  const shown = images.slice(0, COLLAGE_SIZE);
  if (shown.length === 0) {
    return (
      <div className="grid h-full place-items-center rounded-2xl border border-dashed border-white/20 text-sm text-[#f5e6d3]/50">
        Photos coming soon
      </div>
    );
  }
  const [main, ...rest] = shown;
  const mainSpan = rest.length === 0 ? "col-span-3" : "col-span-2";
  const sideSpan = rest.length === 1 ? "row-span-2" : "";

  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-3">
      <div className={`relative row-span-2 overflow-hidden rounded-2xl ${mainSpan}`}>
        <Image
          src={main}
          alt={`${title} by Rangved`}
          fill
          priority={isPriority}
          draggable={false}
          sizes="(max-width: 1024px) 60vw, 40vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover/slide:scale-105 motion-reduce:transition-none"
        />
      </div>
      {rest.map((src) => (
        <div key={src} className={`relative overflow-hidden rounded-2xl ${sideSpan}`}>
          <Image src={src} alt="" fill draggable={false} sizes="(max-width: 1024px) 30vw, 20vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function Events() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = categories.length;

  /** Distance between the starts of two neighbouring slides, in px. */
  const slideStep = useCallback(() => {
    const first = scrollerRef.current?.querySelector<HTMLElement>("[data-slide]");
    return first ? first.offsetWidth + SLIDE_GAP_PX : 0;
  }, []);

  // The row scrolls natively (trackpad, shift+wheel, touch swipe, arrow keys);
  // the buttons and autoplay just scroll the same container.
  const go = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      if (!scroller || total === 0) return;
      const target = ((index % total) + total) % total;
      scroller.scrollTo({ left: target * slideStep(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    [slideStep, total]
  );

  // Snap points are a full slide apart, so a short trackpad flick would spring back;
  // treat each horizontal gesture as "one slide" instead. Touch keeps native momentum.
  useHorizontalWheel(scrollerRef, (direction) => go(current + direction));

  // Keep the counter and active slide in sync with wherever the visitor has scrolled.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = slideStep();
        if (!step) return;
        const isAtEnd = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 2;
        setCurrent(isAtEnd ? total - 1 : Math.min(total - 1, Math.round(scroller.scrollLeft / step)));
      });
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [slideStep, total]);

  // Auto-advance unless the visitor is interacting or prefers reduced motion.
  // Depends on `current`, so any manual scroll restarts the countdown.
  useEffect(() => {
    if (isPaused || total < 2 || prefersReducedMotion()) return;
    const id = setTimeout(() => go(current + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [isPaused, total, current, go]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
        })
        .fromTo(".events-header", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" })
        .fromTo(".events-stage", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.4");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (total === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="events"
      aria-labelledby="events-heading"
      // Desktop: exactly one screen tall (below the fixed nav) so the whole carousel is in view.
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1410] via-[#2d1810] to-[#1a1410] pb-16 pt-24 lg:flex lg:h-[100svh] lg:max-h-[1000px] lg:min-h-[620px] lg:flex-col lg:pb-6 lg:pt-28 lg:[@media(max-height:760px)]:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-10 left-10 h-96 w-96 rounded-full bg-[#e07b39] blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-96 w-96 rounded-full bg-[#d4a853] blur-3xl" />
      </div>

      {/* Header: title on the left, carousel controls on the right */}
      <div className="events-header relative mx-auto mb-6 flex w-full max-w-7xl flex-col gap-5 px-6 md:px-12 lg:mb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#e07b39]">What we create</p>
          <h2
            id="events-heading"
            className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-white md:text-5xl lg:text-4xl xl:text-5xl"
          >
            Events Crafted with{" "}
            <span className="bg-gradient-to-r from-[#e07b39] to-[#d4a853] bg-clip-text text-transparent">Creativity</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#f5e6d3]/70 md:text-base lg:[@media(max-height:760px)]:hidden">
            Every celebration is designed to be visually impactful, emotionally engaging and professionally managed.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/our-work"
            className="mr-2 hidden items-center gap-1.5 py-2 text-sm font-semibold text-[#e09570] underline-offset-4 hover:underline sm:inline-flex lg:hidden xl:inline-flex"
          >
            All our work <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="font-[family-name:var(--font-playfair)] text-[#f5e6d3]/70" aria-live="polite">
            <span className="text-xl font-bold text-white">{pad(current + 1)}</span> / {pad(total)}
          </span>
          <button
            type="button"
            onClick={() => go(current - 1)}
            className="rounded-full border border-white/20 p-3 text-white transition-colors hover:border-[#e07b39] hover:bg-[#e07b39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e07b39]"
            aria-label="Previous event type"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            className="rounded-full bg-[#e07b39] p-3 text-white shadow-lg shadow-[#e07b39]/20 transition-colors hover:bg-[#c06020] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Next event type"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stage: a native scroll-snap row that bleeds to the screen edge; fills the remaining height on desktop */}
      <div
        className="events-stage relative w-full lg:min-h-0 lg:flex-1"
        role="region"
        aria-roledescription="carousel"
        aria-label="Event types"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={scrollerRef}
          tabIndex={0}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain outline-none [--gutter:1.5rem] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e07b39]/50 md:[--gutter:3rem] [&::-webkit-scrollbar]:hidden"
          style={{ gap: SLIDE_GAP_PX, paddingInline: EDGE_PADDING, scrollPaddingInline: EDGE_PADDING }}
        >
          {categories.map((cat, index) => {
            const isActive = index === current;
            return (
              <div
                key={cat.id}
                data-slide
                className={`group/slide h-full shrink-0 snap-start transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
                style={{ width: SLIDE_WIDTH }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}: ${cat.title}`}
              >
                <div className="grid h-full gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:grid-cols-12 lg:gap-8 lg:p-5">
                  <div className="h-[240px] sm:h-[340px] lg:col-span-7 lg:h-full lg:min-h-0">
                    <SlideCollage images={cat.images} title={cat.title} isPriority={index === 0} />
                  </div>

                  <div className="flex flex-col justify-center pb-2 lg:col-span-5 lg:pr-4">
                    <span
                      aria-hidden
                      className="font-[family-name:var(--font-playfair)] text-5xl font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(224,123,57,0.6)] xl:text-6xl lg:[@media(max-height:760px)]:hidden"
                    >
                      {pad(index + 1)}
                    </span>
                    <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-bold text-white md:text-3xl xl:text-4xl lg:[@media(max-height:760px)]:mt-0 lg:[@media(max-height:760px)]:text-3xl">
                      {cat.title}
                    </h3>
                    <div className="my-4 h-px w-16 bg-gradient-to-r from-[#e07b39] to-transparent lg:[@media(max-height:760px)]:my-3" />
                    <p className="line-clamp-5 text-sm leading-relaxed text-[#f5e6d3]/75 md:text-base lg:line-clamp-4 lg:[@media(max-height:760px)]:line-clamp-3">
                      {cat.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 lg:[@media(max-height:760px)]:mt-4">
                      <Link
                        href={`/our-work/${cat.id}`}
                        className="group/cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e07b39] to-[#f0a060] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e07b39]/20 transition-transform hover:-translate-y-0.5"
                      >
                        View gallery
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                      <span className="inline-flex items-center gap-2 text-sm text-[#f5e6d3]/60">
                        <Images className="h-4 w-4" />
                        {cat.images.length} {cat.images.length === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
