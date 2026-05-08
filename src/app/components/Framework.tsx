"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Compass, Clapperboard, RefreshCw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: Layers,
    title: "Foundation",
    subtitle: "Build Basics",
    description:
      "Establishing the core skills of expression, movement, and voice. Every great performance begins with a solid foundation.",
    color: "from-saffron/30 to-terracotta/30",
  },
  {
    number: "02",
    icon: Compass,
    title: "Exploration",
    subtitle: "Discover Self",
    description:
      "Encouraging students to explore their unique voice, emotions, and creative potential through guided improvisation.",
    color: "from-gold/30 to-saffron/30",
  },
  {
    number: "03",
    icon: Clapperboard,
    title: "Performance",
    subtitle: "Apply & Perform",
    description:
      "Taking skills to the stage. Students apply what they've learned in real productions, building confidence through performance.",
    color: "from-maroon/30 to-terracotta/30",
  },
  {
    number: "04",
    icon: RefreshCw,
    title: "Reflection",
    subtitle: "Learn & Grow",
    description:
      "Post-performance reflection and feedback sessions that cement learning and inspire continuous growth.",
    color: "from-olive/30 to-gold/30",
  },
];

export default function Framework() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".framework-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".framework-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".framework-step",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".framework-steps",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="framework"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-charcoal/20 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="framework-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Approach
          </span>
          <h2 className="framework-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Rangved Framework
          </h2>
          <p className="framework-heading text-lg text-cream/60 max-w-2xl mx-auto">
            We don't just train performers — we build confident, expressive
            individuals
          </p>
        </div>

        {/* Steps */}
        <div className="framework-steps grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="framework-step group relative p-8 rounded-2xl bg-charcoal/40 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Number */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center text-2xl font-bold text-gold/40 font-[family-name:var(--font-playfair)] group-hover:scale-110 transition-transform duration-300">
                {step.number}
              </div>

              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="text-saffron-light" size={28} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-cream mb-1 font-[family-name:var(--font-playfair)]">
                {step.title}
              </h3>
              <span className="text-sm text-gold/70 uppercase tracking-wider mb-4 block">
                {step.subtitle}
              </span>
              <p className="text-cream/50 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-gold/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
