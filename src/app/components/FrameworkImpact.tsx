"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

      // Impact Stats (Faster duration and stagger, earlier start)
      gsap.fromTo(
        ".impact-stat",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5, // Sped up from 0.8
          stagger: 0.1,  // Sped up from 0.12
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".impact-stats",
            start: "top 85%", // Trigger as soon as it enters viewport
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
      className="py-24 bg-gradient-to-b from-[#f5e6d3] to-[#e8d5c4]"
      id="impact"
    >
      {/* Impact Section */}
      <div className="impact-section max-w-7xl mx-auto px-6">
        <h2 className="impact-heading text-5xl md:text-6xl font-bold text-[#2d1810] mb-16 text-center font-[family-name:var(--font-playfair)]">
          Impact & Reach
        </h2>

        <div className="impact-stats grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactStats.map((stat, index) => (
            <div
              key={index}
              className="impact-stat bg-gradient-to-br from-[#e07b39] to-[#c06020] rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
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