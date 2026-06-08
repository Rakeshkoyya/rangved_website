"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const backgroundImages = [
  "/images/events/1.jpeg",
  "/images/events/2.png",
  "/images/events/3.JPG",
  "/images/events/4.JPG",
  "/images/events/5.PNG",
  "/images/events/6.jpg",
];

const eventServices = [
  "Wedding Events",
  "Corporate Events",
  "Educational Events",
  "Cultural & Entertainment Events",
  "Social & Community Events",
  "Stage & Performance Events",
];

export default function Events() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".events-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
      )
        .fromTo(
          ".events-description",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".event-item",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          ".events-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          ".events-visual",
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.7"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1410] via-[#2d1810] to-[#1a1410] py-24 md:py-32"
      id="events"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-10 left-10 h-96 w-96 rounded-full bg-[#e07b39] blur-3xl" />
        <div className="absolute -bottom-10 right-10 h-96 w-96 rounded-full bg-[#d4a853] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div className="text-center lg:text-left">
          <h2 className="events-heading font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Events Crafted with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e07b39] to-[#d4a853]">
              Creativity
            </span>
          </h2>

          <p className="events-description mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#f5e6d3]/75 md:text-lg lg:mx-0">
            We execute engaging events with a strong artistic and experiential
            approach — from educational institutions to corporate and social
            gatherings — designed to be{" "}
            <strong className="font-semibold text-[#e09570]">
              visually impactful
            </strong>
            ,{" "}
            <strong className="font-semibold text-[#e09570]">
              emotionally engaging
            </strong>
            , and{" "}
            <strong className="font-semibold text-[#e09570]">
              professionally managed
            </strong>
            .
          </p>

          {/* Services */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {eventServices.map((service) => (
              <div
                key={service}
                className="event-item group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-[#e07b39]/60 hover:bg-white/10"
              >
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#e07b39] transition-transform duration-300 group-hover:scale-150" />
                <span className="text-sm font-medium text-[#f5e6d3] md:text-base">
                  {service}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <p className="events-cta mt-8 text-base text-[#f5e6d3]/70">
            Every event is an opportunity to create lasting memories.
            <span className="mt-2 block text-lg font-semibold text-[#e07b39]">
              Let us bring your vision to life with creativity and precision.
            </span>
          </p>
        </div>

        {/* Visual column — contained slideshow */}
        <div className="events-visual relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            {backgroundImages.map((image, index) => (
              <div
                key={image}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: currentImageIndex === index ? 1 : 0 }}
              >
                <Image
                  src={image}
                  alt="Event highlight"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ))}
            {/* Subtle gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full shadow transition-all duration-300 ${
                    currentImageIndex === index
                      ? "w-8 bg-[#e07b39]"
                      : "w-2 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Decorative accents */}
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#e07b39] opacity-40 blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-[#d4a853] opacity-30 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
