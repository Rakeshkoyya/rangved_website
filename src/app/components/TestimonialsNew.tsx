"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    name: "Principal, Gitanjali Group of Schools",
    role: "Principal",
    year: "2024",
    text: "Bravo! Your talent and commitment made every moment special — truly grateful for your contribution.",
    rating: 5,
    highlight: "Featured",
  },
  {
    name: "Nithya",
    role: "10th Student",
    year: "2025",
    text: "Thank you, Rithik sir, for your incredible guidance. We shine today because of you — excited to learn and perform more with you!",
    rating: 5,
    highlight: "Student Voice",
  },
  {
    name: "Chairman, Walker Town Academy",
    role: "Chairman",
    year: "2024",
    text: "An outstanding mentor! Your ability to train our young students so effectively in a short time is remarkable. We look forward to many more summer camps and workshops together.",
    rating: 5,
    highlight: "Partnership",
  },
  {
    name: "Event Organiser",
    role: "Event Organiser",
    year: "2025",
    text: "Heartfelt thanks to Rithik for his detailed guidance and direction. Applause to our young artists — your hard work truly shone!",
    rating: 5,
  },
  {
    name: "Educator",
    role: "Educator",
    year: "2025",
    text: "Dear Rithik Sir, Thank you for your guidance, trust, and encouragement. This journey has been truly enriching, and we'll always value the lessons and memories gained.",
    rating: 5,
  },
  {
    name: "Amayra",
    role: "Grade 6th",
    year: "2024",
    text: "Dear Sir, Thank you for helping me overcome my stage fear. I'll truly miss dramatics — you were a teacher and a friend.",
    rating: 5,
    highlight: "Impact Story",
  },
  {
    name: "Parent",
    role: "Parent",
    year: "2023",
    text: "Thank you, sir, for training my child so well. He would excitedly share his learnings every day — truly grateful for your support.",
    rating: 5,
  },
];

export default function TestimonialsNew() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const floatingQuoteRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating quote animation
      gsap.to(floatingQuoteRef.current, {
        y: -30,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Title animation with split and stagger
      const titleChars = gsap.utils.toArray(".title-word");
      gsap.from(titleChars, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".testimonials-heading",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Subtitle animation
      gsap.from(".testimonials-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: ".testimonials-heading",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Cards parallax and entrance animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Entrance animation with rotation and scale
        gsap.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: -15,
          duration: 1,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });

        // Parallax effect on scroll
        gsap.to(card, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Mouse move 3D tilt effect
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });

      // Decorative elements animation
      gsap.from(".deco-circle", {
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      id="testimonials"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff9f0] via-[#f5e6d3] to-[#e8d5c4]" />
      
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="deco-circle absolute top-20 left-[10%] w-64 h-64 rounded-full bg-[#e07b39]/5 blur-3xl" />
        <div className="deco-circle absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-[#d4a853]/5 blur-3xl" />
        <div className="deco-circle absolute top-1/2 left-[5%] w-48 h-48 rounded-full bg-[#8b3a3a]/5 blur-3xl" />
      </div>

      {/* Floating Quote Icon */}
      <div
        ref={floatingQuoteRef}
        className="absolute top-24 right-[10%] opacity-10 pointer-events-none hidden lg:block"
      >
        <Quote size={200} className="text-[#e07b39]" strokeWidth={1} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#d4a853] animate-pulse" size={20} />
            <span className="text-[#e07b39] text-sm tracking-[0.3em] uppercase font-semibold">
              Success Stories
            </span>
            <Sparkles className="text-[#d4a853] animate-pulse" size={20} />
          </div>
          
          <h2 className="testimonials-heading text-5xl md:text-7xl font-bold text-[#2d1810] mb-6 font-[family-name:var(--font-playfair)] perspective-1000">
            <span className="title-word inline-block">Voices </span>
            <span className="title-word inline-block">of </span>
            <span className="title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#e07b39] to-[#d4a853]">Transformation</span>
          </h2>
          
          <p className="testimonials-subtitle text-[#4a3428]/70 text-lg md:text-xl max-w-2xl mx-auto">
            Real stories from students, educators, and parents who experienced
            the transformative power of creative learning
          </p>
        </div>

        {/* Desktop: Equal-sized Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="testimonial-card group cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="relative h-full min-h-[380px] bg-gradient-to-br from-white to-[#fff9f0] rounded-3xl p-8 shadow-2xl border border-[#e07b39]/20 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(224,123,57,0.3)] flex flex-col">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {testimonial.highlight && (
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#e07b39] to-[#d4a853] text-white text-xs font-semibold rounded-full mb-4 w-fit">
                      {testimonial.highlight}
                    </span>
                  )}
                  
                  <Quote className="text-[#e07b39] mb-4 transform group-hover:scale-110 transition-transform duration-300" size={36} />
                  
                  <p className="text-[#4a3428] text-base md:text-lg leading-relaxed mb-6 flex-1">
                    "{testimonial.text}"
                  </p>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-[#d4a853] fill-[#d4a853]"
                          size={16}
                        />
                      ))}
                    </div>
                    
                    <div className="border-t border-[#e07b39]/20 pt-4">
                      <p className="text-[#2d1810] font-bold text-lg mb-1">
                        {testimonial.name}
                      </p>
                      <p className="text-[#e07b39] font-medium text-sm">
                        {testimonial.role} • {testimonial.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#e07b39]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#e07b39]/20">
                    {testimonial.highlight && (
                      <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#e07b39] to-[#d4a853] text-white text-xs font-semibold rounded-full mb-4">
                        {testimonial.highlight}
                      </span>
                    )}
                    
                    <Quote className="text-[#e07b39] mb-4" size={36} />
                    
                    <p className="text-[#4a3428] text-lg leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-[#d4a853] fill-[#d4a853]"
                          size={16}
                        />
                      ))}
                    </div>
                    
                    <div className="border-t border-[#e07b39]/20 pt-4">
                      <p className="text-[#2d1810] font-bold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-[#e07b39]">
                        {testimonial.role} • {testimonial.year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#e07b39]/20 flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? "bg-[#e07b39] w-8"
                      : "bg-[#e07b39]/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg border border-[#e07b39]/20 flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300 cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
