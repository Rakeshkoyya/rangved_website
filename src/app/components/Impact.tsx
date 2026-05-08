"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { School, Users, Film, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    icon: School,
    value: 8,
    suffix: "+",
    label: "Schools Served",
    description: "Public and private institutions across Hyderabad",
  },
  {
    icon: Users,
    value: 3,
    suffix: "K",
    label: "Students Trained",
    description: "Age group 6–18 years",
  },
  {
    icon: Film,
    value: 20,
    suffix: "+",
    label: "Productions Directed",
    description: "Original and adapted works",
  },
  {
    icon: Award,
    value: 10,
    suffix: "+",
    label: "Workshops Conducted",
    description: "Short-format and bespoke corporate sessions",
  },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            let start = 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              start = Math.floor(eased * value);
              setCount(start);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(value);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function Impact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".impact-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".impact-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".impact-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".impact-grid",
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
      id="impact"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="impact-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Reach
          </span>
          <h2 className="impact-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Impact & Reach
          </h2>
          <p className="impact-heading text-lg text-cream/60 max-w-2xl mx-auto">
            An evidence-led practice with measurable outcomes in confidence,
            communication and teamwork
          </p>
        </div>

        {/* Stats Grid */}
        <div className="impact-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="impact-card group relative p-8 rounded-2xl bg-charcoal/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 text-center hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="text-saffron-light" size={28} />
              </div>

              <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2 font-[family-name:var(--font-playfair)]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              <h3 className="text-lg font-semibold text-cream mb-2">
                {stat.label}
              </h3>
              <p className="text-sm text-cream/50">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
