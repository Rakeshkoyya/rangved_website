"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Users, BookOpen, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Sparkles,
    title: "Drama Therapy",
    desc: "Using mime, movement & gibberish for neurodivergent students' expression",
  },
  {
    icon: Users,
    title: "Collaborative Team",
    desc: "Working with leading schools & organizations across Hyderabad",
  },
  {
    icon: BookOpen,
    title: "Modern Pedagogy",
    desc: "Rooted in Indian theatrical traditions, shaped by contemporary methods",
  },
  {
    icon: Calendar,
    title: "Transformative Events",
    desc: "Workshops, productions & creative programs that inspire change",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        ".about-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Paragraph animation
      gsap.fromTo(
        ".about-text",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".about-text",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards stagger
      gsap.fromTo(
        ".about-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-cards",
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
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-saffron/3 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="about-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            About Rangved
          </span>
          <h2 className="about-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Voices Awaken.
            <br />
            <span className="text-gradient-gold">Expression Deepens.</span>
          </h2>
          <p className="about-text text-lg md:text-xl text-cream/60 max-w-3xl mx-auto leading-relaxed">
            Rangved is a theatre movement born in Hyderabad in 2023. We direct
            compelling theatre-driven events, experienced in using drama therapy
            and theatre techniques to support neurodivergent students'
            expression and development.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="about-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="about-card group relative p-6 md:p-8 rounded-2xl bg-charcoal/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="text-saffron-light" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-cream mb-2 font-[family-name:var(--font-playfair)]">
                {item.title}
              </h3>
              <p className="text-sm text-cream/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
