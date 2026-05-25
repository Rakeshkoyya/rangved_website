"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const theatrePrograms = [
  "Integrated School Curriculum",
  "Hobby Classes & Clubs",
  "Summer Camps",
  "Workshops & Productions",
  "Inclusive Theatre Programs for neurodivergent learners",
];

const dancePrograms = [
  "School Curriculum Programs",
  "Hobby & Club Sessions",
  "Summer Camps",
  "Stage Performances & Competitions",
  "Choreography-Based Workshops",
  "Annual Day Productions",
];

export default function ServicesNew() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pa-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        },
      });

      gsap.from(".pa-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".pa-grid",
          start: "top 80%",
          end: "top 40%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="performing-arts"
      className="relative py-20 bg-[#faf7f2] border-t border-[#e8d5c4]"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="pa-heading text-4xl md:text-5xl font-semibold text-[#2d1810] mb-3">
            Performing Arts &amp; Creative Services
          </h2>
          <p className="text-xl text-[#4a3428]">Services We Offer</p>
        </div>

        <div className="pa-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theatre Arts */}
          <div className="pa-card bg-white border border-[#e8d5c4] rounded-3xl p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">🎭</div>
              <h3 className="text-3xl font-semibold text-[#2d1810]">Theatre Arts</h3>
            </div>
            <p className="text-[#4a3428] mb-6 leading-relaxed">
              Comprehensive theatre-based training including acting, mime, street theatre, 
              improvisation, storytelling, drama therapy-inspired activities, and expressive movement practices.
            </p>
            <div className="space-y-2 text-sm">
              {theatrePrograms.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#2d1810]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e07b39]"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Dance */}
          <div className="pa-card bg-white border border-[#e8d5c4] rounded-3xl p-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">💃</div>
              <h3 className="text-3xl font-semibold text-[#2d1810]">Dance</h3>
            </div>
            <p className="text-[#4a3428] mb-6 leading-relaxed">
              Dynamic dance programs combining Western, Classical, Folk, Hip-hop, Garba, 
              Zumba and movement-based performance styles that encourage creativity, rhythm, and confidence.
            </p>
            <div className="space-y-2 text-sm">
              {dancePrograms.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#2d1810]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e07b39]"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Annual Day Productions */}
          <div className="pa-card bg-white border border-[#e8d5c4] rounded-3xl p-9 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">🎬</div>
              <h3 className="text-3xl font-semibold text-[#2d1810]">Annual Day Productions</h3>
            </div>
            <p className="text-[#4a3428] leading-relaxed">
              End-to-end conceptualization, scripting, direction, choreography, stage planning, 
              and execution of impactful school productions and performances that create memorable stage experiences.
            </p>
          </div>

          {/* Corporate Workshops */}
          <div className="pa-card bg-white border border-[#e8d5c4] rounded-3xl p-9 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">💼</div>
              <h3 className="text-3xl font-semibold text-[#2d1810]">Corporate Workshops</h3>
            </div>
            <p className="text-[#4a3428] leading-relaxed">
              Interactive theatre, dance, and movement-based workshops designed to enhance communication, 
              leadership, creativity, collaboration, confidence, and team engagement through experiential learning.
            </p>
          </div>
        </div>

        {/* Framework Line */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 bg-[#fff9f0] border border-[#e8d5c4] rounded-full px-8 py-3 text-sm tracking-widest text-[#2d1810]">
            Rangved’s Framework: <span className="font-medium">Foundation</span> • <span className="font-medium">Exploration</span> • <span className="font-medium">Performance</span> • <span className="font-medium">Reflection</span>
          </div>
        </div>
      </div>
    </section>
  );
}
