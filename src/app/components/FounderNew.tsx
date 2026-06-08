"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = [
  { label: "4+ Years", subtitle: "Experience" },
  { label: "15+ Plays", subtitle: "Stage Performances" },
  { label: "100+", subtitle: "Students Mentored" },
];

export default function FounderNew() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        ".founder-heading",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image reveal animation
      gsap.fromTo(
        ".founder-image-wrapper",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-content",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Image border glow animation
      gsap.to(".founder-image-glow", {
        opacity: 0.6,
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Content animation with stagger
      gsap.fromTo(
        ".founder-text",
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-content",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Highlights counter animation (FIXED)
      gsap.fromTo(
        ".highlight-card",
        { y: 40, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".founder-content",
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );

      // Floating animation for image on hover
      if (imageRef.current) {
        imageRef.current.addEventListener("mouseenter", () => {
          gsap.to(".founder-image-wrapper", {
            y: -10,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        imageRef.current.addEventListener("mouseleave", () => {
          gsap.to(".founder-image-wrapper", {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }
    }, sectionRef);

    // Give Next.js a moment to paint the DOM before calculating triggers
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-[#f5ebe0] via-[#fff9f0] to-[#faf7f2] relative overflow-hidden"
      id="founder"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#e07b39] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#d4a853] rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="founder-heading inline-block">
            <span className="text-[#e07b39] text-sm font-semibold tracking-widest uppercase mb-2 block">
              The Visionary
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1810] font-[family-name:var(--font-playfair)]">
              Meet the Founder
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#e07b39] to-[#d4a853] mx-auto mt-4 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Container - Single Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-[#e07b39]/20 overflow-hidden">
          {/* Main Content Grid */}
          <div className="founder-content grid lg:grid-cols-[40%_60%] gap-8 lg:gap-10 p-6 md:p-8 lg:p-10">
            {/* Image Column */}
            <div ref={imageRef} className="relative">
              <div className="founder-image-wrapper relative group">
                {/* Glow effect */}
                <div className="founder-image-glow absolute inset-0 bg-gradient-to-br from-[#e07b39] to-[#d4a853] rounded-2xl blur-2xl opacity-0 transition-opacity duration-500"></div>
                
                {/* Image container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    src="/images/founder/founder.jpg"
                    alt="Rithik Thakur - Founder of Rangved"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e07b39] to-[#d4a853] animate-pulse"></div>
                  )}
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-[#e07b39] rounded-xl opacity-15 -z-10"></div>
                <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-[#d4a853] rounded-xl opacity-15 -z-10"></div>
              </div>

              {/* Highlights Section */}
              <div className="highlights-container grid grid-cols-3 gap-3 mt-6">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="highlight-card bg-gradient-to-br from-[#e07b39]/10 to-[#d4a853]/10 backdrop-blur-sm rounded-xl p-3 text-center shadow-md border border-[#e07b39]/20 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-xl md:text-2xl font-bold text-[#e07b39] mb-1 font-[family-name:var(--font-playfair)]">
                      {item.label}
                    </div>
                    <div className="text-xs md:text-sm text-[#4a3428] font-medium">
                      {item.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Column */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="founder-text text-3xl md:text-4xl font-bold text-[#2d1810] mb-2 font-[family-name:var(--font-playfair)]">
                  Rithik Thakur
                </h3>
                <p className="founder-text text-lg md:text-xl text-[#e07b39] font-semibold mb-5">
                  Theatre Practitioner & Facilitator
                </p>

                <div className="space-y-4 text-[#4a3428] text-sm md:text-base leading-relaxed">
                  <p className="founder-text">
                    A dynamic theatre facilitator with <strong className="text-[#e07b39]">4+ years of experience</strong> mentoring 
                    children and adults across Hyderabad. With a diploma in Performing Arts, Rithik 
                    specializes in acting, stage direction, script adaptation, and character development.
                  </p>
                  <p className="founder-text">
                    Alongside his work as a facilitator, he is an active performer — having acted in{" "}
                    <strong className="text-[#e07b39]">15+ stage plays</strong>, featured in the film{" "}
                    <strong className="text-[#2d1810]">Harom Hara (2024)</strong>, and shared screen 
                    space with Anchor Suma in a comedy series (2023). He is also a YouTube content creator, 
                    blending performance with digital storytelling.
                  </p>
                  <p className="founder-text">
                    Through Rangved, he brings together theatre, training, and experiential events to 
                    create impactful performances and transformative learning experiences.
                  </p>
                </div>

                <div className="founder-text mt-5 flex flex-wrap items-center gap-2 text-[#4a3428] bg-gradient-to-r from-[#e07b39]/5 to-[#d4a853]/5 p-3 rounded-xl border border-[#e07b39]/10">
                  <span className="text-xl">🌍</span>
                  <span className="text-sm md:text-base">
                    Fluent in <strong>English, Hindi, Telugu</strong> • Based in Begumpet, Hyderabad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}