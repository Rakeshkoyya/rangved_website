"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PenTool,
  Theater,
  Heart,
  Users,
  Lightbulb,
  Wrench,
  Music,
  Presentation,
  Languages,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const expertise = [
  { icon: PenTool, label: "Original script writing & direction" },
  { icon: Theater, label: "Mime, improvisation & physical theatre" },
  { icon: Heart, label: "Character-building & confidence development" },
  { icon: Users, label: "Training teachers and learners across all ages" },
  { icon: Lightbulb, label: "Interactive and creative theatre-based activities" },
  { icon: Wrench, label: "Conflict resolution & group facilitation" },
  { icon: Music, label: "Music and theatre technicals (lights, stage, sound)" },
  { icon: Presentation, label: "PowerPoint presentations and visual storytelling" },
];

export default function Founder() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".founder-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".founder-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".founder-content",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".expertise-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".expertise-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="founder"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-charcoal/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="founder-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Leadership
          </span>
          <h2 className="founder-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Meet the Founder
          </h2>
        </div>

        {/* Founder Content */}
        <div className="founder-content grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-cream mb-2 font-[family-name:var(--font-playfair)]">
              Rithik Thakur
            </h3>
            <p className="text-saffron-light text-lg mb-6">
              Theatre Practitioner & Facilitator
            </p>

            <div className="space-y-4 text-cream/70 leading-relaxed mb-8">
              <p>
                A dynamic theatre facilitator with 4+ years of experience
                mentoring children and adults across Hyderabad. With a diploma
                in Performing Arts, Rithik specializes in acting, stage
                direction, script adaptation, and character development.
              </p>
              <p>
                Alongside his work as a facilitator, he is an active performer —
                having acted in 15+ stage plays, featured in the film{" "}
                <span className="text-gold">Harom Hara (2024)</span>, and shared
                screen space with Anchor Suma in a comedy series (2023). He is
                also a YouTube content creator, blending performance with
                digital storytelling.
              </p>
              <p>
                Through Rangved, he brings together theatre, training, and
                experiential events to create impactful performances and
                transformative learning experiences.
              </p>
            </div>

            {/* Languages & Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-cream/50">
              <div className="flex items-center gap-2">
                <Languages size={16} className="text-gold/60" />
                <span>English, Hindi, Telugu</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gold/40" />
              <span>Based in Begumpet, Hyderabad</span>
            </div>
          </div>

          {/* Right - Placeholder for Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-charcoal-light to-charcoal border border-gold/10 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-saffron/30 to-gold/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-bold text-gold font-[family-name:var(--font-playfair)]">
                    R
                  </span>
                </div>
                <p className="text-cream/40 text-sm">
                  Founder Photo
                  <br />
                  <span className="text-xs">(Replace with actual image)</span>
                </p>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -inset-3 border border-gold/10 rounded-2xl -z-10" />
            <div className="absolute -inset-6 border border-gold/5 rounded-3xl -z-20" />
          </div>
        </div>

        {/* Core Expertise */}
        <div>
          <h3 className="text-2xl font-bold text-cream mb-8 text-center font-[family-name:var(--font-playfair)]">
            Core Expertise
          </h3>
          <div className="expertise-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expertise.map((item, i) => (
              <div
                key={i}
                className="expertise-item flex items-start gap-3 p-4 rounded-xl bg-charcoal/30 border border-gold/5 hover:border-gold/20 transition-all duration-300"
              >
                <item.icon
                  size={18}
                  className="text-saffron-light mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-cream/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
