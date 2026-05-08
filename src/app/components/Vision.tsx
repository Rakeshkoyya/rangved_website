"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Trophy,
  Lightbulb,
  CalendarDays,
  Award,
  Network,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const visionPoints = [
  {
    icon: MapPin,
    text: "Expanding across Telangana and allied states to reach diverse communities",
  },
  {
    icon: Trophy,
    text: "Organizing inter-school theatre festivals that celebrate young talent",
  },
  {
    icon: Lightbulb,
    text: "Conceptualizing and delivering end-to-end event management with a strong theatrical and experiential touch",
  },
  {
    icon: Award,
    text: "Introducing certification programmes to nurture and recognize performers",
  },
  {
    icon: CalendarDays,
    text: "Designing and executing theatre-driven events and experiences",
  },
  {
    icon: Network,
    text: "Building a strong ecosystem connecting schools, corporates, and communities",
  },
];

export default function Vision() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vision-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vision-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".vision-text",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".vision-text",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".vision-point",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vision-points",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-saffron/5 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="vision-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Looking Ahead
          </span>
          <h2 className="vision-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Our Vision 2027
          </h2>
          <p className="vision-text text-lg md:text-xl text-cream/60 max-w-3xl mx-auto leading-relaxed">
            To build a transformative ecosystem where theatre, education, and
            event experiences come together to shape confident, creative, and
            conscious individuals.
          </p>
        </div>

        {/* Vision Statement */}
        <div className="max-w-4xl mx-auto mb-16 p-8 md:p-12 rounded-2xl bg-charcoal/40 border border-gold/10 text-center">
          <p className="text-xl md:text-2xl text-cream/80 leading-relaxed font-[family-name:var(--font-playfair)] italic">
            "At Rangved, we envision creating impactful stages and thoughtfully
            curated events that go beyond performance — enabling people to
            discover their voice, build meaningful connections, and lead with
            confidence in every sphere of life."
          </p>
        </div>

        {/* Vision Points */}
        <div className="vision-points grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionPoints.map((point, i) => (
            <div
              key={i}
              className="vision-point group flex items-start gap-4 p-6 rounded-xl bg-charcoal/30 border border-gold/5 hover:border-gold/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <point.icon className="text-saffron-light" size={20} />
              </div>
              <p className="text-cream/70 text-sm leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
