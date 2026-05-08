"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const showcaseItems = [
  {
    id: 1,
    title: "Indian Evolution",
    subtitle: "Annual Day Production",
    year: "2023",
    description: "A theatrical journey through India's transformation",
    image: "/images/work_legacy/1.JPG",
    color: "#e07b39",
  },
  {
    id: 2,
    title: "Slurping Beauty",
    subtitle: "Summer Camp Production",
    year: "2023",
    description: "A whimsical twist on classic fairy tales",
    image: "/images/work_legacy/2.PNG",
    color: "#d4a853",
  },
  {
    id: 3,
    title: "Naari Shakti",
    subtitle: "Special Performance",
    year: "2025",
    description: "Celebrating the power and resilience of women",
    image: "/images/work_legacy/5.jpeg",
    color: "#c97856",
  },
  {
    id: 4,
    title: "Mai Hu Tiranga",
    subtitle: "Patriotic Production",
    year: "2024",
    description: "A tribute to the spirit of India",
    image: "/images/work_legacy/4.JPG",
    color: "#f4a261",
  },
  {
    id: 5,
    title: "Street Play & Mime",
    subtitle: "Social Awareness",
    year: "2026",
    description: "Powerful storytelling without words",
    image: "/images/work_legacy/3.jpeg",
    color: "#8b3a3a",
  },
  {
    id: 6,
    title: "The Emperor's New Hair",
    subtitle: "Summer Camp Comedy",
    year: "2023",
    description: "Hilarious reimagining of a timeless tale",
    image: "/images/work_legacy/7.JPG",
    color: "#7d8f4a",
  },
  {
    id: 7,
    title: "Mirror Mirror",
    subtitle: "Corporate Workshop",
    year: "2023",
    description: "Reflecting on identity and transformation",
    image: "/images/work_legacy/6.jpg",
    color: "#e09570",
  },
];

export default function LegacyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - title visible, items hidden
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      itemRefs.current.forEach((item) => {
        if (item) {
          gsap.set(item, { opacity: 0 });
          const img = item.querySelector(".legacy-image");
          const content = item.querySelector(".legacy-content");
          const number = item.querySelector(".legacy-number");
          gsap.set(img, { scale: 1.3, rotation: -5 });
          gsap.set(content, { x: 100, opacity: 0 });
          gsap.set(number, { scale: 0, opacity: 0 });
        }
      });

      // Create main timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 1. Title stays visible (0-0.10)
      // Title is already visible from initial setup

      // 2. Title moves up and fades (0.10-0.15)
      mainTl
        .to(titleRef.current, {
          y: -150,
          opacity: 0,
          scale: 0.8,
          duration: 0.05,
          ease: "power2.in",
        }, 0.10);

      // 3. Showcase items (0.15-1.0, leaving last item visible till end)
      const itemStart = 0.15;
      const itemEnd = 1.0;
      const itemDuration = (itemEnd - itemStart) / showcaseItems.length;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const startTime = itemStart + index * itemDuration;
        const exitTime = startTime + itemDuration * 0.7;
        const isLastItem = index === showcaseItems.length - 1;

        const img = item.querySelector(".legacy-image");
        const content = item.querySelector(".legacy-content");
        const number = item.querySelector(".legacy-number");
        const title = item.querySelector(".legacy-title");
        const subtitle = item.querySelector(".legacy-subtitle");
        const desc = item.querySelector(".legacy-desc");
        const year = item.querySelector(".legacy-year");

        // Reveal animations based on index for variety
        if (index % 3 === 0) {
          // Zoom reveal with rotation
          const tl = mainTl
            .to(item, { opacity: 1, duration: 0 }, startTime)
            .to(img, {
              scale: 1,
              rotation: 0,
              duration: itemDuration * 0.3,
              ease: "power2.out",
            }, startTime)
            .to(number, {
              scale: 1,
              opacity: 0.1,
              duration: itemDuration * 0.2,
              ease: "back.out(1.7)",
            }, startTime + itemDuration * 0.1)
            .to(content, {
              x: 0,
              opacity: 1,
              duration: itemDuration * 0.25,
              ease: "power2.out",
            }, startTime + itemDuration * 0.15)
            .fromTo([title, subtitle, desc, year], {
              y: 30,
              opacity: 0,
            }, {
              y: 0,
              opacity: 1,
              duration: itemDuration * 0.2,
              stagger: itemDuration * 0.03,
              ease: "power2.out",
            }, startTime + itemDuration * 0.2);
          
          // Only add exit animation if not the last item
          if (!isLastItem) {
            tl.to(item, {
              opacity: 0,
              scale: 0.95,
              duration: itemDuration * 0.15,
              ease: "power2.in",
            }, exitTime);
          }

        } else if (index % 3 === 1) {
          // Slide from left
          const tl = mainTl
            .to(item, { opacity: 1, duration: 0 }, startTime)
            .fromTo(img, {
              x: -window.innerWidth,
              scale: 1.2,
            }, {
              x: 0,
              scale: 1,
              duration: itemDuration * 0.35,
              ease: "power3.out",
            }, startTime)
            .to(number, {
              scale: 1,
              opacity: 0.1,
              duration: itemDuration * 0.2,
              ease: "back.out(1.7)",
            }, startTime + itemDuration * 0.15)
            .to(content, {
              x: 0,
              opacity: 1,
              duration: itemDuration * 0.25,
              ease: "power2.out",
            }, startTime + itemDuration * 0.2)
            .fromTo([title, subtitle, desc, year], {
              x: -50,
              opacity: 0,
            }, {
              x: 0,
              opacity: 1,
              duration: itemDuration * 0.2,
              stagger: itemDuration * 0.03,
              ease: "power2.out",
            }, startTime + itemDuration * 0.25);
          
          // Only add exit animation if not the last item
          if (!isLastItem) {
            tl.to(item, {
              x: window.innerWidth,
              opacity: 0,
              duration: itemDuration * 0.2,
              ease: "power2.in",
            }, exitTime);
          }

        } else {
          // Circular reveal
          const tl = mainTl
            .to(item, { opacity: 1, duration: 0 }, startTime)
            .fromTo(img, {
              clipPath: "circle(0% at 50% 50%)",
              scale: 1.5,
            }, {
              clipPath: "circle(70% at 50% 50%)",
              scale: 1,
              duration: itemDuration * 0.35,
              ease: "power2.out",
            }, startTime)
            .to(number, {
              scale: 1,
              opacity: 0.1,
              rotation: 360,
              duration: itemDuration * 0.25,
              ease: "back.out(1.7)",
            }, startTime + itemDuration * 0.1)
            .to(content, {
              x: 0,
              opacity: 1,
              duration: itemDuration * 0.25,
              ease: "power2.out",
            }, startTime + itemDuration * 0.2)
            .fromTo([title, subtitle, desc, year], {
              scale: 0.8,
              opacity: 0,
            }, {
              scale: 1,
              opacity: 1,
              duration: itemDuration * 0.2,
              stagger: itemDuration * 0.03,
              ease: "back.out(1.7)",
            }, startTime + itemDuration * 0.25);
          
          // Only add exit animation if not the last item
          if (!isLastItem) {
            tl.to(item, {
              opacity: 0,
              filter: "blur(20px)",
              duration: itemDuration * 0.15,
              ease: "power2.in",
            }, exitTime);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#1a1410] overflow-hidden"
      id="legacy"
      style={{ height: "100vh" }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#2d1810] to-[#1a1410]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-96 h-96 bg-[#e07b39] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#d4a853] rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>

        {/* Title Screen */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center px-6">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e07b39] via-[#d4a853] to-[#e09570] mb-6 font-[family-name:var(--font-playfair)]">
              Our Legacy
            </h2>
            <p className="text-xl md:text-3xl text-[#f5e6d3]/80 tracking-wide">
              7 Remarkable Productions That Define Excellence
            </p>
          </div>
        </div>

        {/* Showcase Items */}
        {showcaseItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="absolute inset-0 z-10"
          >
            {/* Giant number in background */}
            <div
              className="legacy-number absolute 
                         top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[35vw] opacity-[0.08]
                         lg:top-1/2 lg:left-[70%] lg:text-[40vw] lg:opacity-[0.05]
                         font-bold pointer-events-none z-0"
              style={{ color: item.color }}
            >
              {item.id}
            </div>

            {/* Content Grid */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Image Side */}
                  <div className="legacy-image relative">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index < 2}
                      />
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                      />
                    </div>
                    {/* Decorative elements */}
                    <div
                      className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-50"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  {/* Text Side */}
                  <div className="legacy-content space-y-6">
                    <div className="legacy-year inline-block px-8 py-4 rounded-2xl text-3xl md:text-4xl font-black tracking-wider shadow-2xl border-2"
                      style={{
                        backgroundColor: item.color,
                        color: '#1a1410',
                        borderColor: `${item.color}`,
                        boxShadow: `0 0 40px ${item.color}80, 0 0 80px ${item.color}40`,
                      }}
                    >
                      {item.year}
                    </div>
                    <h3 className="legacy-title text-5xl md:text-6xl lg:text-7xl font-bold text-[#f5e6d3] font-[family-name:var(--font-playfair)] leading-tight">
                      {item.title}
                    </h3>
                    <p className="legacy-subtitle text-2xl md:text-3xl font-semibold"
                      style={{ color: item.color }}
                    >
                      {item.subtitle}
                    </p>
                    <p className="legacy-desc text-xl md:text-2xl text-[#f5e6d3]/80 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
