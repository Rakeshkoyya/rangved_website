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
    title: "Mirror Mirror",
    subtitle: "Theatre Production",
    year: "2023",
    description: "The Exyte Company",
    image: "/images/work_legacy/1.JPG",
    color: "#e07b39",
  },
  {
    id: 2,
    title: "The Emperor's New Hair",
    subtitle: "Theatre Production",
    year: "2023",
    description: "Walker Town Academy, Secunderabad",
    image: "/images/work_legacy/2.PNG",
    color: "#d4a853",
  },
  {
    id: 3,
    title: "Life of Alluri Seetharamaraju",
    subtitle: "School Production",
    year: "2024",
    description: "Gitanjali Vedika School",
    image: "/images/work_legacy/3.jpeg",
    color: "#c97856",
  },
  {
    id: 4,
    title: "Mai Hu Tiranga",
    subtitle: "School Production",
    year: "2024",
    description: "Gitanjali Primary School",
    image: "/images/work_legacy/4.JPG",
    color: "#f4a261",
  },
  {
    id: 5,
    title: "Hazaaron Salaam Mere Desh ke liye",
    subtitle: "School Production",
    year: "2025",
    description: "Gitanjali Vedika School",
    image: "/images/work_legacy/5.jpeg",
    color: "#8b3a3a",
  },
  {
    id: 6,
    title: "Ghar Ghar ki Kahani",
    subtitle: "Alumni Event",
    year: "2025",
    description: "Gitanjali Group of Schools",
    image: "/images/work_legacy/6.jpg",
    color: "#7d8f4a",
  },
  {
    id: 7,
    title: "Naari Shakti",
    subtitle: "School Production",
    year: "2025",
    description: "Gitanjali Primary School",
    image: "/images/work_legacy/7.JPG",
    color: "#e09570",
  },
  {
    id: 8,
    title: "Street Play & Mime on Superstition",
    subtitle: "Social Awareness",
    year: "2026",
    description: "St. Joseph High School",
    image: "/images/work_legacy/3.jpeg",
    color: "#e07b39",
  },
];

export default function LegacyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".legacy-item", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="py-20 bg-[#faf7f2] border-t border-[#e8d5c4]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#2d1810]">Our Work / Our Legacy</h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item) => (
            <div key={item.id} className="legacy-item group bg-white border border-[#e8d5c4] rounded-2xl overflow-hidden hover:border-[#e07b39] transition-all">
              <div className="relative h-48 bg-[#f5e6d3]">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-white/80">{item.year}</div>
                  <div className="text-xl font-semibold text-white">{item.title}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm text-[#e07b39] font-medium mb-1">{item.subtitle}</div>
                <p className="text-[#4a3428] text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-[#6b5c52]">
          Dance performances: Classical • Western • Folk • Hip-hop • Garba • Zumba
        </div>
      </div>
    </section>
  );
}
