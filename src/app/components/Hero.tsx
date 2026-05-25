"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff9f0] via-[#f5e6d3] to-[#e8d5c4]"
      id="hero"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e07b39] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4a853] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#c97856] rounded-full blur-3xl"></div>
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
            className="object-contain"
            priority
          />
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} className="mb-12">
          <p className="text-2xl md:text-4xl text-[#2d1810] max-w-5xl mx-auto leading-tight font-medium tracking-tight">
            Voices Awaken. Expression deepens.<br />Potential takes the stage.
          </p>
          <p className="text-lg md:text-xl text-[#4a3428] mt-4 tracking-[3px]">
            Performing Arts • Events • Expression • Transformation
          </p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#about"
            className="px-8 py-4 bg-[#e07b39] text-white font-semibold rounded-full hover:bg-[#c06020] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-base"
          >
            Discover our story
          </a>
          <a
            href="#work"
            className="px-8 py-4 border-2 border-[#e07b39] text-[#e07b39] font-medium rounded-full hover:bg-[#e07b39] hover:text-white transition-all duration-300 hover:-translate-y-1 text-base"
          >
            Explore Our Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-[#e07b39] text-[#e07b39] font-medium rounded-full hover:bg-[#e07b39] hover:text-white transition-all duration-300 hover:-translate-y-1 text-base"
          >
            Get in Touch — Partner With Us
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#e07b39]"
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
