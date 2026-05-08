"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    id: 1,
    title: "Integrated Theatre Curriculum",
    description:
      "A structured theatre program embedded into school learning, developing confidence, communication, and creativity through performance-based education.",
    icon: "🎭",
    color: "from-[#e07b39] to-[#f0a060]",
    revealType: "fade-overlay",
    image: "/images/services/1.jpeg",
  },
  {
    id: 2,
    title: "Hobby Classes & Clubs",
    description:
      "Weekly sessions — Engaging after-school theatre sessions that nurture self-expression, imagination, and stage confidence in a fun, creative environment.",
    icon: "🎨",
    color: "from-[#d4a853] to-[#e5c578]",
    revealType: "horizontal-wipe",
    image: "/images/services/2.png",
  },
  {
    id: 3,
    title: "Summer Camps",
    description:
      "Interactive theatre camps designed to build personality, teamwork, and creativity, culminating in a grand final performance.",
    icon: "☀️",
    color: "from-[#f4a261] to-[#e09570]",
    revealType: "explosion",
    image: "/images/services/3.JPG",
  },
  {
    id: 4,
    title: "Event Management",
    description:
      "Conceptualizing and executing creative events and performances with a strong theatrical touch — from ideation to execution.",
    icon: "🎪",
    color: "from-[#c97856] to-[#e09570]",
    revealType: "circular-reveal",
    image: "/images/services/4.JPG",
  },
  {
    id: 5,
    title: "Annual Day Productions",
    description:
      "Full production management — End-to-end planning and direction of school productions — from script to stage — creating impactful and memorable performances.",
    icon: "🎬",
    color: "from-[#8b3a3a] to-[#b55555]",
    revealType: "split-slide",
    image: "/images/services/5.PNG",
  },
  {
    id: 6,
    title: "Corporate Workshops",
    description:
      "Theatre-based training programs focused on communication, leadership, team building, and employee engagement.",
    icon: "💼",
    color: "from-[#7d8f4a] to-[#a0b56a]",
    revealType: "blocks-build",
    image: "/images/services/6.jpg",
  },
  {
    id: 7,
    title: "Mime & Street Theatre",
    description:
      "Powerful, message-driven performances that raise social awareness through expressive, non-verbal and street-style storytelling.",
    icon: "🎪",
    color: "from-[#e07b39] to-[#d4a853]",
    revealType: "diagonal-reveal",
    image: "/images/services/7.PNG",
  },
];

export default function ServicesNew() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hide title and all services initially
      // gsap.set(titleRef.current, { opacity: 0, y: 50 });
      gsap.set(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
        });
      
      serviceRefs.current.forEach((service) => {
        if (service) gsap.set(service, { opacity: 0 });
      });

      // Main scroll timeline - pins the content area
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          pin: contentRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 1. Title fade in (0-0.05)
      mainTl.to(
        titleRef.current,
        { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
        0
      );

      // 2. Title hold (0.05-0.08) - no animation needed

      // 3. Title move up (0.08-0.12)
      mainTl.to(
        titleRef.current,
        { scale: 0.7, y: -100, duration: 0.04, ease: "power2.inOut" },
        0.08
      );

      // 4. Title fade out (0.12-0.14)
      mainTl.to(
        titleRef.current,
        { opacity: 0, duration: 0.02, ease: "power2.out" },
        0.12
      );

      // Services animation starts
      const pathStart = 0.14;
      const pathDuration = 0.86;

      // 5. Animate each service with unique creative reveals
      const serviceStartTime = pathStart;
      const serviceSegment = pathDuration / services.length;

      serviceRefs.current.forEach((service, index) => {
        if (!service) return;

        const revealTime = serviceStartTime + serviceSegment * index;
        const hideTime = revealTime + serviceSegment * 0.7;
        const revealType = services[index].revealType;

        const bgImage = service.querySelector(".service-bg") as HTMLElement;
        const content = service.querySelector(".service-content") as HTMLElement;
        const titleEl = service.querySelector(".service-title") as HTMLElement;
        const descEl = service.querySelector(".service-desc") as HTMLElement;
        const iconEl = service.querySelector(".service-icon") as HTMLElement;

        switch (revealType) {
          // Service 1: Background fade in, then text overlay
          case "fade-overlay":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { opacity: 0, scale: 1.2 },
                { opacity: 1, scale: 1, duration: 0.03, ease: "power2.out" },
                revealTime
              )
              .fromTo(
                content,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.025, ease: "power2.out" },
                revealTime + 0.015
              )
              .to(service, { opacity: 0, duration: 0.02 }, hideTime);
            break;

          // Service 2: Horizontal wipe revealing image, text slides in
          case "horizontal-wipe":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 0.04, ease: "power2.inOut" },
                revealTime
              )
              .fromTo(
                content,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.03, ease: "power2.out" },
                revealTime + 0.02
              )
              .to(service, { opacity: 0, duration: 0.02 }, hideTime);
            break;

          // Service 3: Explosion from center
          case "explosion":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.05, ease: "back.out(2)" },
                revealTime
              )
              .fromTo(
                [titleEl, descEl, iconEl],
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.025,
                  stagger: 0.008,
                  ease: "back.out(1.7)",
                },
                revealTime + 0.025
              )
              .to(service, { scale: 0, opacity: 0, duration: 0.025 }, hideTime);
            break;

          // Service 4: Circular reveal from dot position
          case "circular-reveal":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { clipPath: "circle(0% at 50% 50%)" },
                { clipPath: "circle(70% at 50% 50%)", duration: 0.04, ease: "power2.out" },
                revealTime
              )
              .fromTo(
                content,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.03, ease: "power2.out" },
                revealTime + 0.02
              )
              .to(service, { opacity: 0, duration: 0.02 }, hideTime);
            break;

          // Service 5: Split screen slide
          case "split-slide":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { x: "-100%" },
                { x: "0%", duration: 0.04, ease: "power2.inOut" },
                revealTime
              )
              .fromTo(
                content,
                { x: "100%", opacity: 0 },
                { x: "0%", opacity: 1, duration: 0.04, ease: "power2.inOut" },
                revealTime
              )
              .to(service, { opacity: 0, duration: 0.02 }, hideTime);
            break;

          // Service 6: Vertical blocks assembly
          case "blocks-build":
            const blockEls = service.querySelectorAll(".block-piece");
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                blockEls,
                { y: (i) => (i % 2 === 0 ? -100 : 100), opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.035,
                  stagger: 0.005,
                  ease: "power2.out",
                },
                revealTime
              )
              .fromTo(
                content,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.025, ease: "back.out(1.5)" },
                revealTime + 0.02
              )
              .to(service, { opacity: 0, duration: 0.02 }, hideTime);
            break;

          // Service 7: Diagonal reveal
          case "diagonal-reveal":
            mainTl
              .to(service, { opacity: 1, duration: 0 }, revealTime)
              .fromTo(
                bgImage,
                { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
                {
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  duration: 0.045,
                  ease: "power2.inOut",
                },
                revealTime
              )
              .fromTo(
                content,
                { x: 50, y: 50, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.03, ease: "power2.out" },
                revealTime + 0.02
              )
              .to(service, { opacity: 1, duration: 0.02 }, hideTime);
            break;
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-b from-[#f5e6d3] to-[#fff9f0]"
      id="services"
      style={{ height: "600vh" }}
    >
      {/* Pinned Content Area */}
      <div
        ref={contentRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Title - Will reveal and move up then disappear */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2d1810] mb-4 font-[family-name:var(--font-playfair)] text-center px-6">
            Our Journey of Services
          </h2>
          <p className="text-lg md:text-xl text-[#4a3428] text-center px-6">
            Follow the path through our transformative offerings
          </p>
        </div>

        {/* Service displays - stacked absolutely */}
        {services.map((service, index) => (
          <div
            key={service.id}
            ref={(el) => {
              serviceRefs.current[index] = el;
            }}
            className="absolute inset-0 z-10"
          >
            {/* Background Image */}
            <div className="service-bg absolute inset-0">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index < 2}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="service-content absolute inset-0 flex items-center justify-center p-8 md:p-16 z-20">
              <div className="max-w-4xl mx-auto text-center">
                <div className={`service-icon text-6xl md:text-8xl mb-6 drop-shadow-2xl`}>
                  {service.icon}
                </div>
                <h3 className="service-title text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)] drop-shadow-2xl">
                  {service.title}
                </h3>
                <p className="service-desc text-lg md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Special elements for specific reveal types */}
            {service.revealType === "blocks-build" && (
              <>
                <div className="block-piece absolute top-0 left-0 w-1/3 h-1/2 bg-[#e07b39]/20" />
                <div className="block-piece absolute top-0 right-0 w-1/3 h-1/2 bg-[#d4a853]/20" />
                <div className="block-piece absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#c97856]/20" />
                <div className="block-piece absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#f4a261]/20" />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
