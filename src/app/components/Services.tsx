"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GraduationCap,
  Drama,
  Palette,
  Sun,
  PartyPopper,
  Briefcase,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: GraduationCap,
    title: "Integrated Theatre Curriculum",
    description:
      "A structured theatre program embedded into school learning, developing confidence, communication, and creativity through performance-based education.",
    color: "from-saffron/20 to-terracotta/20",
    borderColor: "border-saffron/20",
  },
  {
    icon: Drama,
    title: "Mime & Street Theatre",
    description:
      "Powerful, message-driven performances that raise social awareness through expressive, non-verbal and street-style storytelling.",
    color: "from-maroon/20 to-terracotta/20",
    borderColor: "border-maroon/20",
  },
  {
    icon: Palette,
    title: "Hobby Classes & Clubs",
    description:
      "Engaging after-school theatre sessions that nurture self-expression, imagination, and stage confidence in a fun, creative environment.",
    color: "from-olive/20 to-gold/20",
    borderColor: "border-olive/20",
  },
  {
    icon: Sun,
    title: "Summer Camps",
    description:
      "Interactive theatre camps designed to build personality, teamwork, and creativity, culminating in a grand final performance.",
    color: "from-gold/20 to-saffron/20",
    borderColor: "border-gold/20",
  },
  {
    icon: PartyPopper,
    title: "Annual Day Productions",
    description:
      "End-to-end planning and direction of school productions — from script to stage — creating impactful and memorable performances.",
    color: "from-terracotta/20 to-maroon/20",
    borderColor: "border-terracotta/20",
  },
  {
    icon: Briefcase,
    title: "Corporate Workshops",
    description:
      "Theatre-based training programs focused on communication, leadership, team building, and employee engagement.",
    color: "from-charcoal-light/30 to-gold/20",
    borderColor: "border-gold/20",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".service-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-grid",
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
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-charcoal/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="services-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Services
          </span>
          <h2 className="services-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Core Services
          </h2>
          <p className="services-heading text-lg text-cream/60 max-w-2xl mx-auto">
            Conceptualizing and executing creative events and performances with a
            strong theatrical touch — from ideation to execution.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`service-card group relative p-8 rounded-2xl bg-charcoal/40 border ${service.borderColor} hover:border-gold/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="text-saffron-light" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-cream mb-3 font-[family-name:var(--font-playfair)]">
                  {service.title}
                </h3>
                <p className="text-cream/50 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
