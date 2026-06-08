"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const heroImages = [
  "/images/hero/1.JPG",
  "/images/hero/2.JPG",
  "/images/hero/3.PNG",
  "/images/hero/4.PNG",
  "/images/hero/5.PNG",
  "/images/hero/6.jpeg",
  "/images/hero/7.jpeg",
];

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1a1410]"
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
              className="object-cover scale-105 blur-[3px]"
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div
          ref={titleRef}
          className="relative h-32 sm:h-40 md:h-48 w-full max-w-3xl mx-auto mb-8"
        >
          <Image
            src="/images/founder/rangved.png"
            alt="Rangved"
            fill
            className="object-contain [filter:drop-shadow(0_2px_18px_rgba(255,255,255,0.55))]"
            priority
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl md:text-3xl text-[#f5e6d3] max-w-4xl mx-auto mb-12 leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          Performing Arts • Events • Expression • Transformation
        </p>

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
            Explore Our Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-white/80 text-white font-medium rounded-full hover:bg-white hover:text-[#1a1410] transition-all duration-300 hover:-translate-y-1 text-base backdrop-blur-sm"
          >
            Partner With Us
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
