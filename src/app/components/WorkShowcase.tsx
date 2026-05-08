"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

// YouTube video links - Replace these placeholders with actual links
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/watch?v=V5Ei3RkByr0",
  "https://www.youtube.com/watch?v=RzhNmN9jrCM",
  "https://www.youtube.com/watch?v=bCQ3DEqkV_A",
];

// Extract YouTube video ID from URL
const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function WorkShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % YOUTUBE_VIDEOS.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? YOUTUBE_VIDEOS.length - 1 : prev - 1
    );
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-[#e8d5c4] to-[#fff9f0]"
      id="work"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="work-heading text-5xl md:text-6xl font-bold text-[#2d1810] mb-16 text-center font-[family-name:var(--font-playfair)]">
          Our Work in Motion
        </h2>

        <div className="relative">
          {/* Video Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
            <iframe
              src={getYouTubeEmbedUrl(YOUTUBE_VIDEOS[currentIndex])}
              title={`Video ${currentIndex + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevVideo}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 shadow-lg"
            aria-label="Previous video"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 shadow-lg"
            aria-label="Next video"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {YOUTUBE_VIDEOS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#e07b39] w-8"
                    : "bg-[#e07b39]/30 hover:bg-[#e07b39]/50"
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>

          {/* Video Counter */}
          <div className="text-center mt-6 text-[#4a3428] text-lg">
            <span className="font-semibold text-[#e07b39]">
              {currentIndex + 1}
            </span>{" "}
            / {YOUTUBE_VIDEOS.length}
          </div>
        </div>
      </div>
    </section>
  );
}
