"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Film, Tent, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const productions = [
  {
    category: "Annual Day Events",
    icon: Calendar,
    items: [
      { name: "Street play & mime act", year: "2026" },
      { name: "Indian Evolution", year: "2023" },
      { name: "Old Roots New Wings, Timeless Truths", year: "2024" },
    ],
  },
  {
    category: "Summer Camps",
    icon: Tent,
    items: [
      { name: "Slurping Beauty", year: "2023" },
      { name: "The Goose Girl", year: "2023" },
      { name: "The Emperor's New Hair", year: "2023" },
    ],
  },
  {
    category: "Various Events",
    icon: Star,
    items: [
      { name: "Ghar Ghar ki Kahani", year: "2025" },
      { name: "Naari Shakti", year: "2025" },
      { name: "Navadurga", year: "2025" },
      { name: "Hazaaron Salaam Mere Desh ke liye", year: "2025" },
      { name: "Heart to Smart", year: "2025" },
      { name: "Toys After Dark", year: "2025" },
      { name: "The Great Experiment Gone Wrong", year: "2025" },
      { name: "The Popsicle Don", year: "2024" },
      { name: "The Imaginary Adventure MIME", year: "2024" },
      { name: "Evolution of Social Media", year: "2024" },
      { name: "Aliens in the Playground", year: "2024" },
      { name: "Mai Hu Tiranga", year: "2024" },
      { name: "Life of Alluri Seetharamaraju", year: "2024" },
    ],
  },
  {
    category: "Corporate Productions",
    icon: Film,
    items: [{ name: "Mirror Mirror", year: "2023" }],
  },
];

export default function Legacy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".legacy-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".legacy-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".legacy-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".legacy-grid",
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
      id="legacy"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-maroon/5 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="legacy-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Journey
          </span>
          <h2 className="legacy-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Rangved's Stage Legacy
          </h2>
          <p className="legacy-heading text-lg text-cream/60 max-w-2xl mx-auto">
            A collection of transformative productions and events that have
            shaped our journey since 2023.
          </p>
        </div>

        {/* Productions Grid */}
        <div className="legacy-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {productions.map((section, i) => (
            <div
              key={i}
              className="legacy-card p-6 md:p-8 rounded-2xl bg-charcoal/40 border border-gold/10 hover:border-gold/30 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center">
                  <section.icon className="text-saffron-light" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-cream font-[family-name:var(--font-playfair)]">
                  {section.category}
                </h3>
              </div>

              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0 group hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-cream/70 group-hover:text-cream transition-colors text-sm md:text-base">
                      {item.name}
                    </span>
                    <span className="text-gold/60 text-sm font-medium px-2 py-0.5 rounded-full bg-gold/5">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
