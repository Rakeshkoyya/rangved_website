"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// YouTube video links - Replace these placeholders with actual links
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/watch?v=V5Ei3RkByr0",
  "https://www.youtube.com/watch?v=RzhNmN9jrCM",
  "https://www.youtube.com/watch?v=bCQ3DEqkV_A",
];

const getYouTubeId = (url: string) => url.split("v=")[1]?.split("&")[0] ?? "";

const getEmbedUrl = (url: string) =>
  `https://www.youtube.com/embed/${getYouTubeId(url)}?rel=0&modestbranding=1`;

const getThumbnail = (url: string) =>
  `https://img.youtube.com/vi/${getYouTubeId(url)}/hqdefault.jpg`;

export default function WorkShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextVideo = () =>
    setCurrentIndex((prev) => (prev + 1) % YOUTUBE_VIDEOS.length);

  const prevVideo = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? YOUTUBE_VIDEOS.length - 1 : prev - 1
    );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#e8d5c4] to-[#fff9f0] py-16 md:py-24"
      id="work"
    >
      {/* Decorative accents */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-[#e07b39]/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[#d4a853]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="work-heading mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#e07b39]">
            <Play size={14} className="fill-[#e07b39]" /> Showreel
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-5xl font-bold text-[#2d1810] md:text-6xl">
            Our Work in Motion
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#e07b39] to-[#d4a853]" />
        </div>

        <div className="relative">
          {/* Video frame with gradient border + glow */}
          <div className="rounded-[28px] bg-gradient-to-br from-[#e07b39] to-[#d4a853] p-[3px] shadow-[0_25px_70px_-15px_rgba(224,123,57,0.45)]">
            <div className="relative aspect-video overflow-hidden rounded-[25px] bg-black">
              <iframe
                key={currentIndex}
                src={getEmbedUrl(YOUTUBE_VIDEOS[currentIndex])}
                title={`Video ${currentIndex + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevVideo}
            className="absolute -left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#e07b39] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#e07b39] hover:text-white md:-left-6 md:h-14 md:w-14"
            aria-label="Previous video"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextVideo}
            className="absolute -right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#e07b39] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#e07b39] hover:text-white md:-right-6 md:h-14 md:w-14"
            aria-label="Next video"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {YOUTUBE_VIDEOS.map((url, index) => (
            <button
              key={url}
              onClick={() => setCurrentIndex(index)}
              className={`group relative aspect-video w-28 overflow-hidden rounded-xl transition-all duration-300 sm:w-36 ${
                index === currentIndex
                  ? "scale-105 ring-2 ring-[#e07b39] ring-offset-2 ring-offset-[#fff9f0]"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Play video ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getThumbnail(url)}
                alt={`Video ${index + 1} thumbnail`}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Play size={20} className="fill-white text-white" />
              </span>
              {index === currentIndex && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={20} className="fill-white text-white" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-6 text-center text-[#4a3428]">
          <span className="font-semibold text-[#e07b39]">{currentIndex + 1}</span>{" "}
          / {YOUTUBE_VIDEOS.length}
        </div>
      </div>
    </section>
  );
}
