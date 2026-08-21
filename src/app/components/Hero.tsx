"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { siteImages } from "@/content/manifest";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const heroImages = siteImages.hero;

const TAGLINE = ["Weddings", "Corporate", "Social", "Cultural Events"];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-advancing background slideshow with smooth crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Curtain reveal animation
      gsap.fromTo(
        heroRef.current,
        { clipPath: "inset(0 50% 0 50%)" },
        {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1.5,
          ease: "power4.inOut",
        }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.5,
          ease: "power3.out",
        }
      );

      // Subtitle fade in
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 }
      );

      // Scroll indicator parallax
      gsap.to(".scroll-indicator", {
        y: 30,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "50% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1410] py-28 sm:py-32"
      id="hero"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentImage === index ? 1 : 0 }}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover scale-105"
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1810]/20 via-[#4a3428]/55 to-[#8b3a3a]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-w-0 max-w-6xl mx-auto px-6 text-center">
        <h1
          ref={titleRef}
          className="relative h-24 sm:h-36 md:h-48 w-full max-w-xs sm:max-w-xl md:max-w-3xl mx-auto mb-6 sm:mb-8"
        >
          <span className="sr-only">
            Rangved — Event Management &amp; Performing Arts Company in
            Hyderabad
          </span>
          <Image
            src={siteImages.logo}
            alt="Rangved logo"
            fill
            className="object-contain"
            priority
          />
        </h1>

        {/* Tagline — primary line, display serif.
            Each item stays unbroken; <wbr /> gives the browser a break
            opportunity between items so narrow screens wrap cleanly. */}
        <p
          ref={subtitleRef}
          className="font-[family-name:var(--font-playfair)] text-[1.375rem] sm:text-3xl md:text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.25] sm:leading-[1.15] text-[#fff9f0] max-w-4xl md:max-w-none mx-auto mb-5 sm:mb-6 md:mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
        >
          {TAGLINE.map((item, index) => (
            <Fragment key={item}>
              <span className="whitespace-nowrap">
                {item}
                {index < TAGLINE.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mx-2 md:mx-3 align-middle text-[0.5em] text-[#d4a853]"
                  >
                    &#9670;
                  </span>
                )}
              </span>
              {index < TAGLINE.length - 1 && <wbr />}
            </Fragment>
          ))}
        </p>

        {/* Supporting sub-tag — quieter, spaced small caps.
            Held to a single line from md up via a fluid clamped size. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-3 md:gap-5 mb-10 sm:mb-12"
        >
          <span
            aria-hidden="true"
            className="hidden md:block h-px w-12 lg:w-20 shrink-0 bg-gradient-to-r from-transparent to-[#d4a853]/60"
          />
          <p className="min-w-0 max-w-xs sm:max-w-md text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] leading-[1.9] text-[#f5e6d3]/75 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] md:max-w-none md:whitespace-nowrap md:text-[clamp(0.6875rem,1.05vw,0.875rem)] md:tracking-[0.28em] md:leading-relaxed md:-mr-[0.28em]">
            Professionally Managed &middot; Creatively Crafted &middot; Memorable
            by Design
          </p>
          <span
            aria-hidden="true"
            className="hidden md:block h-px w-12 lg:w-20 shrink-0 bg-gradient-to-l from-transparent to-[#d4a853]/60"
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#work"
            className="px-8 py-4 bg-[#e07b39] text-white font-semibold rounded-full hover:bg-[#c06020] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-base"
          >
            Explore Our Events
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-white/80 text-white font-medium rounded-full hover:bg-white hover:text-[#1a1410] transition-all duration-300 hover:-translate-y-1 text-base backdrop-blur-sm"
          >
            Plan Your Event
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f5e6d3]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
