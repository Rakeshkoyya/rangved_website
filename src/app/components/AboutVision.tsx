"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Drama, Lightbulb, Users, Workflow } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    icon: Lightbulb,
    title: "Creative Direction",
    body: "From concept and theme development to storytelling and entertainment, we bring creativity into every event.",
  },
  {
    icon: Workflow,
    title: "End-to-End Execution",
    body: "Planning, coordination, production, vendors, artists, technical requirements, and on-ground management — handled with precision.",
  },
  {
    icon: Drama,
    title: "Artistic Expertise",
    body: "Our experience in theatre, dance, live performance and stage production helps us create events that are engaging, expressive and memorable.",
  },
  {
    icon: Users,
    title: "People & Experiences",
    body: "We design experiences that bring people together — whether it's a corporate gathering, school celebration, wedding, cultural event or community occasion.",
  },
];

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

      // fromTo (not from) with an explicit start state: a `from` tween that
      // also uses stagger gets reset by ScrollTrigger's immediateRender pass
      // and leaves the staggered elements stuck at opacity 0.
      gsap.fromTo(
        ".about-pillar",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-pillars",
            start: "top 85%",
          },
        }
      );

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
      className="relative py-14 md:py-20 bg-gradient-to-br from-[#fff9f0] via-[#fef3e8] to-[#fff9f0] overflow-hidden"
      id="about"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e07b39] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2d1810] rounded-full blur-3xl"></div>
      </div>

      <div className="about-section relative max-w-4xl mx-auto px-6 md:px-8">
        {/* Heading */}
        <h2 className="about-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1810] mb-3 text-center font-[family-name:var(--font-playfair)] tracking-tight">
          About Rangved
        </h2>
        
        {/* Subtitle */}
        <p className="about-heading text-base md:text-lg text-[#4a3428]/70 text-center max-w-2xl mx-auto mb-8 md:mb-10 font-light">
          An event management company with a creative and artistic edge.
        </p>

        {/* Main Content Card */}
        <div className="about-card group relative bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-500 border border-[#e07b39]/10 hover:border-[#e07b39]/20">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#e07b39] to-transparent rounded-t-3xl"></div>
          
          <div className="space-y-5 text-[#4a3428] leading-relaxed">
            {/* Intro paragraph */}
            <p className="text-[15px] md:text-base leading-relaxed">
              <span className="highlight-text inline-block bg-gradient-to-r from-[#e07b39]/20 to-transparent bg-[length:0%_100%] bg-no-repeat transition-all duration-1000" style={{ backgroundSize: "100% 100%" }}>
                Rangved is an <strong className="font-semibold text-[#2d1810]">event</strong>
              </span>
               <strong className="font-semibold text-[#2d1810]"> management company based in Hyderabad,</strong>{" "}
              delivering thoughtfully planned and professionally executed events across corporate, wedding, educational, cultural, social, and private spaces.
              <br />
               We bring together<strong className="font-semibold text-[#2d1810]"> event planning, creative direction, production, entertainment, and on-ground execution</strong> to transform ideas into well-crafted experiences. Our foundation in theatre and performing arts adds a distinctive creative touch to every event we create.  
              
            </p>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#e07b39]/30 to-transparent" />

            {/* What we bring — run-in pointer list, not cards */}
            <div className="about-pillars space-y-4">
              <div className="about-pillar">
                <h3 className="text-center font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-[#2d1810]">
                  What We Bring
                </h3>
                <div
                  aria-hidden="true"
                  className="mx-auto mt-2 h-px w-10 bg-gradient-to-r from-transparent via-[#e07b39] to-transparent"
                />
              </div>

              <ul className="grid list-none gap-x-8 gap-y-4 sm:grid-cols-2">
                {PILLARS.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="about-pillar flex gap-2.5">
                    <Icon
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-[5px] shrink-0 text-[#e07b39]"
                    />
                    <p className="text-pretty text-[14px] leading-relaxed text-[#4a3428]/85">
                      <strong className="font-semibold text-[#2d1810]">
                        {title}
                      </strong>
                      <span aria-hidden="true" className="text-[#e07b39]">
                        {" — "}
                      </span>
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Philosophy - highlighted box */}
            <div>
              <div className="rounded-xl border-l-[3px] border-[#e07b39] bg-gradient-to-r from-[#fff9f0] to-white px-4 py-3 md:px-5 md:py-4">
                <p className="text-[15px] md:text-base leading-relaxed">
                  From the first idea to the final moment, Rangved brings together{" "}
                  <strong className="font-semibold text-[#e07b39]">
                    creativity, coordination and flawless execution
                  </strong>{" "}
                  to create{" "}
                  <strong className="font-semibold text-[#2d1810]">
                    experiences worth remembering
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}