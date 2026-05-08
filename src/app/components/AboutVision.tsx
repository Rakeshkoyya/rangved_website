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
      // About section animation
      gsap.from(".about-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });

      gsap.from(".about-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
      });

      // Vision section animation
      gsap.from(".vision-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".vision-section",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });

      gsap.from(".vision-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".vision-section",
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
      });

      gsap.from(".vision-list-item", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".vision-list",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-24 bg-gradient-to-b from-[#fff9f0] to-[#f5e6d3]"
      id="about"
    >
      {/* About Section */}
      <div className="about-section max-w-6xl mx-auto px-4 md:px-6 mb-16 md:mb-32">
        <h2 className="about-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1810] mb-6 md:mb-12 font-[family-name:var(--font-playfair)]">
          About Rangved
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-base md:text-lg text-[#4a3428] leading-relaxed">
          {/* Mobile Shortened About */}
          <div className="about-text space-y-4 md:hidden">
            <p>
              <strong className="text-[#e07b39] text-xl block mb-1">
                Rangved is a theatre movement
              </strong>
              born in Hyderabad in 2023. We combine drama therapy, expert event management, and modern pedagogy to support expression and transform learning into stage-worthy moments.
            </p>
          </div>

          {/* Desktop Original About Part 1 */}
          <div className="about-text space-y-4 hidden md:block">
            <p>
              <strong className="text-[#e07b39] text-2xl block mb-2">
                Rangved is a theatre movement
              </strong>
              born in Hyderabad in 2023. Voices awaken. Expression deepens. Potential takes the stage.
            </p>
            <p>
              Direct compelling theatre-driven events. Experienced in using drama therapy and theatre techniques 
              (mime, movement, gibberish) to support neurodivergent students' expression and development.
            </p>
          </div>

          {/* Desktop Original About Part 2 */}
          <div className="about-text space-y-4 hidden md:block">
            <p>
              Organizing workshops, productions & creative programs. Transform learning into stage-worthy moments. 
              Expert event management.
            </p>
            <p>
              Rooted in Indian theatrical traditions, shaped by modern pedagogy. A passionate team collaborating 
              with leading schools, organizations to create transformative experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="vision-section max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-[#e07b39]/20">
          <h2 className="vision-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1810] mb-4 md:mb-6 font-[family-name:var(--font-playfair)]">
            Our Vision 2027
          </h2>

          {/* Mobile Shortened Vision Text */}
          <p className="vision-text text-base md:hidden text-[#4a3428] mb-6 leading-relaxed">
            To build a transformative ecosystem combining theatre, education, and events to shape confident, creative individuals. We aim to help people discover their voice and build meaningful connections.
          </p>

          {/* Desktop Original Vision Text */}
          <p className="vision-text text-xl hidden md:block text-[#4a3428] mb-8 leading-relaxed max-w-4xl">
            To build a transformative ecosystem where theatre, education, and event experiences come together 
            to shape confident, creative, and conscious individuals. At Rangved, we envision creating impactful 
            stages and thoughtfully curated events that go beyond performance — enabling people to discover their 
            voice, build meaningful connections, and lead with confidence in every sphere of life.
          </p>

          <h3 className="vision-text text-2xl md:text-3xl font-semibold text-[#e07b39] mb-4 md:mb-6 mt-6 md:mt-12">
            Our Vision in Action
          </h3>

          {/* Mobile Condensed Vision List */}
          <ul className="vision-list space-y-3 md:hidden">
            <li className="vision-list-item flex items-start gap-2">
              <span className="text-[#e07b39] text-xl">•</span>
              <span className="text-[#4a3428] text-sm">
                Expanding across Telangana to reach diverse communities
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-2">
              <span className="text-[#e07b39] text-xl">•</span>
              <span className="text-[#4a3428] text-sm">
                Organizing inter-school theatre festivals & certifications
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-2">
              <span className="text-[#e07b39] text-xl">•</span>
              <span className="text-[#4a3428] text-sm">
                Delivering theatre-driven event management experiences
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-2">
              <span className="text-[#e07b39] text-xl">•</span>
              <span className="text-[#4a3428] text-sm">
                Connecting schools, corporates, and communities
              </span>
            </li>
          </ul>

          {/* Desktop Original Vision List */}
          <ul className="vision-list space-y-4 hidden md:block">
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Expanding across Telangana and allied states to reach diverse communities
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Organizing inter-school theatre festivals that celebrate young talent
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Conceptualizing and delivering end-to-end event management with a strong theatrical and experiential touch
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Introducing certification programmes to nurture and recognize performers
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Designing and executing theatre-driven events and experiences
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Creating platforms for holistic development through performance and participation
              </span>
            </li>
            <li className="vision-list-item flex items-start gap-3">
              <span className="text-[#e07b39] text-2xl">•</span>
              <span className="text-[#4a3428] text-lg">
                Building a strong ecosystem connecting schools, corporates, and communities
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}