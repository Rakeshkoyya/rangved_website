"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const carouselSlides = [
  {
    id: 1,
    title: "Theatre Arts",
    description:
      "Comprehensive theatre-based training including acting, mime, street theatre, improvisation, storytelling, drama therapy-inspired activities, and expressive movement practices.",
    icon: "🎭",
    color: "from-[#e07b39] to-[#f0a060]",
    image: "/images/services/1.jpeg",
    programs: [
      "Integrated School Curriculum",
      "Hobby Classes & Clubs",
      "Summer Camps",
      "Workshops & Productions",
      "Inclusive Theatre Programs for neurodivergent learners",
    ],
  },
  {
    id: 2,
    title: "Dance",
    description:
      "Dynamic dance programs combining Western, Classical, Folk, Hiphop, Garba, Zumba and movement-based performance styles that encourage creativity, rhythm, Confidence.",
    icon: "💃",
    color: "from-[#d4a853] to-[#e5c578]",
    image: "/images/services/2.png",
    programs: [
      "School Curriculum Programs",
      "Hobby & Club Sessions",
      "Summer Camps",
      "Stage Performances & Competitions",
      "Choreography-Based Workshops",
    ],
  },
  {
    id: 3,
    title: "Annual Day Productions & Corporate Workshops",
    services: [
      {
        title: "Annual Day Productions",
        description:
          "End-to-end conceptualization, scripting, direction, choreography, stage planning, and execution of impactful school productions and performances that create memorable stage experiences.",
        icon: "🎬",
      },
      {
        title: "Corporate Workshops",
        description:
          "Interactive theatre, dance, and movement-based workshops designed to enhance communication, leadership, creativity, collaboration, confidence, and team engagement through experiential learning activities.",
        icon: "💼",
      },
    ],
    color: "from-[#c97856] to-[#e09570]",
    image: "/images/services/5.PNG",
  },
];

export default function ServicesNew() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-b from-[#f5e6d3] via-[#fff9f0] to-[#fef8f0] py-16 md:py-32"
      id="services"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d1810] mb-3 font-[family-name:var(--font-playfair)]">
            Performing Arts & Creative Services
          </h2>
          <p className="text-lg md:text-xl text-[#d4a853] font-medium">
            Services We Offer
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Slides Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="min-w-full"
                >
                  {/* Slide Content */}
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Regular Slides (1 & 2) - Side by Side Layout */}
                    {slide.programs ? (
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Side */}
                        <div className="relative h-64 md:h-auto">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-20`} />
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <h3 className="text-3xl md:text-4xl font-bold text-[#2d1810] mb-4 font-[family-name:var(--font-playfair)]">
                            {slide.title}
                          </h3>
                          <p className="text-base md:text-lg text-[#4a3428] leading-relaxed mb-6">
                            {slide.description}
                          </p>
                          
                          {/* Programs List */}
                          <div className="bg-[#fff9f0] rounded-xl p-6 border-l-4 border-[#e07b39]">
                            <h4 className="text-lg font-semibold text-[#2d1810] mb-4">
                              Programs Offered:
                            </h4>
                            <ul className="space-y-2">
                              {slide.programs.map((program, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm md:text-base text-[#4a3428] flex items-start gap-2"
                                >
                                  <span className="text-[#e07b39] mt-1 flex-shrink-0">•</span>
                                  <span>{program}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Combined Slide (3) - Grid Layout */
                      <div>
                        {/* Image Header */}
                        <div className="relative h-48 md:h-64">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={index === 0}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-30`} />
                        </div>

                        {/* Two Services Grid */}
                        <div className="grid md:grid-cols-2 gap-6 p-8 md:p-12">
                          {slide.services?.map((service, idx) => (
                            <div
                              key={idx}
                              className="bg-[#fff9f0] rounded-xl p-6 border-t-4 border-[#e07b39] hover:shadow-lg transition-shadow"
                            >
                              <h3 className="text-2xl md:text-3xl font-bold text-[#2d1810] mb-3 font-[family-name:var(--font-playfair)]">
                                {service.title}
                              </h3>
                              <p className="text-sm md:text-base text-[#4a3428] leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-[#e07b39] hover:bg-[#c06020] text-white p-3 rounded-full transition-all duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-[#e07b39] hover:bg-[#c06020] text-white p-3 rounded-full transition-all duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-10 h-3 bg-[#e07b39]"
                    : "w-3 h-3 bg-[#d4a853]/40 hover:bg-[#d4a853]/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Framework Box */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#e07b39]/20 text-center mt-16">
          <p className="text-xl md:text-2xl text-[#4a3428] leading-relaxed font-medium">
            <span className="text-[#e07b39] font-semibold">Rangved's Framework:</span>{" "}
            Foundation <span className="text-[#e07b39] mx-2">→</span> Exploration{" "}
            <span className="text-[#e07b39] mx-2">→</span> Performance{" "}
            <span className="text-[#e07b39] mx-2">→</span> Reflection
          </p>
        </div>
      </div>
    </section>
  );
}
