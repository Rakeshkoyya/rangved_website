"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const impactStats = [
  { value: "8+", label: "Schools Served", desc: "Public and private institutions across Hyderabad" },
  { value: "3K", label: "Students Trained", desc: "Age group 6–18 years" },
  { value: "20+", label: "Productions Directed", desc: "Original and adapted works" },
  { value: "10+", label: "Workshops Conducted", desc: "Short-format and bespoke corporate sessions for Adults & Kids" },
];

export default function FrameworkImpact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Mobile carousel state ──────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stageHeight, setStageHeight] = useState(280);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Size the stage to the active card so nothing clips and there's no dead space.
  useEffect(() => {
    const measure = () => {
      const h = cardRefs.current[currentSlide]?.offsetHeight ?? 0;
      if (h > 0) setStageHeight(h);
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [currentSlide]);

  // Coverflow transform: the active card sits on top; its neighbours peek out to
  // the sides, faint and blurred. Cards further away fade out entirely.
  const getCardStyle = (index: number): CSSProperties => {
    const total = impactStats.length;
    let offset = index - currentSlide;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const base = "translateX(-50%)";

    if (offset === 0) {
      return {
        transform: `${base} translateX(0px) scale(1)`,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 30,
        pointerEvents: "auto",
      };
    }

    if (Math.abs(offset) > 1) {
      return {
        transform: `${base} translateX(${offset < 0 ? -400 : 400}px) scale(0.7)`,
        opacity: 0,
        filter: "blur(8px)",
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    const shift = offset < 0 ? -260 : 260;
    return {
      transform: `${base} translateX(${shift}px) scale(0.82)`,
      opacity: 0.35,
      filter: "blur(4px)",
      zIndex: 10,
      pointerEvents: "none",
    };
  };

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % impactStats.length);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + impactStats.length) % impactStats.length);

  // Auto-advance, matching the testimonials carousel.
  useEffect(() => {
    const id = setInterval(
      () => setCurrentSlide((p) => (p + 1) % impactStats.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Impact section heading
      gsap.fromTo(
        ".impact-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".impact-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Impact Stats (Faster duration and stagger, earlier start) — desktop grid
      gsap.fromTo(
        ".impact-stat",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".impact-stats",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    // Ensure Next.js layout shifts don't mess up the start triggers
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-[#f5e6d3] to-[#e8d5c4]"
      id="impact"
    >
      {/* Impact Section */}
      <div className="impact-section max-w-7xl mx-auto px-6">
        <h2 className="impact-heading text-5xl md:text-6xl font-bold text-[#2d1810] mb-16 text-center font-[family-name:var(--font-playfair)]">
          Impact & Reach
        </h2>

        {/* ── Mobile carousel (coverflow) ───────────────────────────────────── */}
        <div className="sm:hidden mb-12">
          <div
            className="relative transition-[height] duration-700 ease-out"
            style={{ height: stageHeight }}
          >
            {impactStats.map((stat, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 w-full max-w-xs px-2 will-change-transform transition-[transform,opacity,filter] duration-700 ease-out"
                style={getCardStyle(i)}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flex min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-[#e07b39] to-[#c06020] rounded-3xl p-8 text-center shadow-xl"
                >
                  <div className="text-5xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold text-white/90 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed">
                    {stat.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-11 h-11 rounded-full bg-white shadow-[0_4px_20px_rgba(224,123,57,0.18)] border border-[#e07b39]/20 flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Previous stat"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {impactStats.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlide ? "bg-[#e07b39] w-8" : "bg-[#e07b39]/30 w-2"
                  }`}
                  aria-label={`Go to stat ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-11 h-11 rounded-full bg-white shadow-[0_4px_20px_rgba(224,123,57,0.18)] border border-[#e07b39]/20 flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Next stat"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ── Desktop grid ──────────────────────────────────────────────────── */}
        <div className="impact-stats hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="impact-stat flex min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-[#e07b39] to-[#c06020] rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-5xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white/90 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-white/80 leading-relaxed">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#e07b39]/20 text-center">
          <p className="text-xl text-[#4a3428] leading-relaxed">
            An <span className="text-[#e07b39] font-semibold">evidence-led practice</span> with
            measurable outcomes in{" "}
            <span className="text-[#e07b39] font-semibold">confidence</span>,{" "}
            <span className="text-[#e07b39] font-semibold">communication</span> and{" "}
            <span className="text-[#e07b39] font-semibold">teamwork</span>
          </p>
        </div>
      </div>
    </section>
  );
}
