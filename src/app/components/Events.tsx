"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const eventTypes = [
  "Wedding Events",
  "Corporate Events",
  "Educational Events",
  "Cultural & Entertainment Events",
  "Social & Community Events",
  "Stage & Performance Events",
];

export default function Events() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".events-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });

      gsap.from(".events-content", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        },
      });

      gsap.from(".event-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".events-grid",
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
      id="events"
      className="relative py-20 bg-[#fff9f0] border-t border-[#e8d5c4]"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="events-heading text-4xl md:text-5xl font-semibold text-[#2d1810] mb-4">
            Events Crafted with Creativity
          </h2>
          <p className="events-content text-lg text-[#4a3428] max-w-3xl mx-auto leading-relaxed">
            We execute engaging events with a strong artistic and experiential approach. 
            From educational institutions to corporate and social gatherings, we design 
            experiences that are visually impactful, emotionally engaging, and professionally managed.
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="events-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {eventTypes.map((event, index) => (
            <div
              key={index}
              className="event-card group bg-white border border-[#e8d5c4] rounded-2xl p-8 hover:border-[#e07b39] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#e07b39]"></div>
                <h3 className="text-xl font-medium text-[#2d1810] group-hover:text-[#e07b39] transition-colors">
                  {event}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-[#6b5c52]">
          Background photos of stage &amp; events available in Drive
        </div>
      </div>
    </section>
  );
}
