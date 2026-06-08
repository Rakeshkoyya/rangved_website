"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutVision() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-heading", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
        },
      });

      gsap.from(".about-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-card",
          start: "top 85%",
        },
      });

      gsap.from(".highlight-text", {
        backgroundSize: "0% 100%",
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".highlight-text",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-br from-[#fff9f0] via-[#fef3e8] to-[#fff9f0] overflow-hidden"
      id="about"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e07b39] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2d1810] rounded-full blur-3xl"></div>
      </div>

      <div className="about-section relative max-w-5xl mx-auto px-6 md:px-8">
        {/* Heading */}
        <h2 className="about-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1810] mb-6 text-center font-[family-name:var(--font-playfair)] tracking-tight">
          About Rangved
        </h2>
        
        {/* Subtitle */}
        <p className="about-heading text-lg md:text-xl text-[#4a3428]/70 text-center max-w-3xl mx-auto mb-16 font-light">
          A creative performing arts and experiential events organization
        </p>

        {/* Main Content Card */}
        <div className="about-card group relative bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 border border-[#e07b39]/10 hover:border-[#e07b39]/20">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e07b39] to-transparent rounded-t-3xl"></div>
          
          <div className="space-y-6 text-[#4a3428] leading-relaxed">
            {/* Intro paragraph */}
            <p className="text-lg md:text-xl">
              <span className="highlight-text inline-block bg-gradient-to-r from-[#e07b39]/20 to-transparent bg-[length:0%_100%] bg-no-repeat transition-all duration-1000" style={{ backgroundSize: "100% 100%" }}>
                Rangved is a creative
              </span>  performing arts and experiential events organization based in Hyderabad, dedicated to building <strong className="font-semibold text-[#2d1810]">expression, confidence, creativity</strong>, and meaningful experiences through art and engagement.
            </p>

            {/* Divider */}
            <div className="py-2">
              <div className="h-px bg-gradient-to-r from-transparent via-[#e07b39]/30 to-transparent"></div>
            </div>

            {/* Core services */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2d1810] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#e07b39] rounded-full"></span>
                  Our Expertise
                </h3>
                <p className="text-base pl-4">
                  Blending <strong className="font-medium text-[#2d1810]">theatre, dance, storytelling</strong>, and event experiences, we collaborate with schools, corporates, and communities to create impactful productions, workshops, cultural events, and immersive learning environments.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2d1810] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#e07b39] rounded-full"></span>
                  What We Do
                </h3>
                <p className="text-base pl-4">
                  From theatre productions and performing arts training to corporate events, educational programs, and curated experiences — we <strong className="font-medium text-[#2d1810]">transform ideas into memorable moments</strong>.
                </p>
              </div>
            </div>

            {/* Philosophy - highlighted box */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e07b39]/5 via-[#e07b39]/10 to-[#e07b39]/5 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-[#fff9f0] to-white p-6 md:p-8 rounded-2xl border-l-4 border-[#e07b39]">
                <p className="text-base md:text-lg leading-relaxed">
                  {/* <span className="text-2xl text-[#e07b39] mr-2">"</span> */}
                  Rooted in <strong className="font-semibold text-[#e07b39]">Indian aesthetics</strong> and shaped by modern creative practices, we believe in using art not just as performance — but as a <strong className="font-semibold text-[#2d1810]">powerful medium for connection, transformation, and celebration</strong>.
                  {/* <span className="text-2xl text-[#e07b39] ml-1">"</span> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}