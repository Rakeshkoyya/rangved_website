"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Send, Sparkles } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const heroImages = [
  "/images/hero/1.JPG",
  "/images/hero/2.JPG",
  "/images/hero/3.PNG",
  "/images/hero/4.PNG",
  "/images/hero/5.PNG",
  "/images/hero/6.jpeg",
  "/images/hero/7.jpeg",
];

export default function ContactNew() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  // Background slideshow with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    backgroundRefs.current.forEach((bg, index) => {
      if (!bg) return;
      gsap.to(bg, {
        opacity: index === currentImage ? 1 : 0,
        duration: 1,
        ease: "power2.inOut",
      });
    });
  }, [currentImage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Title animation
      const titleChars = gsap.utils.toArray(".contact-title-word");
      gsap.fromTo(
        titleChars,
        { y: 80, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          stagger: 0.05,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".contact-heading",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Subtitle animation
      gsap.fromTo(
        ".contact-subtitle",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: {
            trigger: ".contact-heading",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Cards animation (The core fix for the missing buttons/cards)
      gsap.fromTo(
        ".contact-card",
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-content",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Form animation
      gsap.fromTo(
        ".contact-form",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    // Give Next.js a moment to paint the DOM and custom fonts before calculating triggers
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
      id="contact"
    >
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            ref={(el) => {
              backgroundRefs.current[index] = el;
            }}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1810]/90 via-[#4a3428]/85 to-[#8b3a3a]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-[#e07b39]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-[#d4a853]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-[#d4a853] animate-pulse" size={18} />
            <span className="text-[#e07b39] text-xs md:text-sm tracking-[0.3em] uppercase font-semibold">
              Let's Connect
            </span>
            <Sparkles className="text-[#d4a853] animate-pulse" size={18} />
          </div>
          
          <h2 className="contact-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 font-[family-name:var(--font-playfair)]">
            <span className="contact-title-word inline-block mr-3 md:mr-4">Get</span>
            <span className="contact-title-word inline-block mr-3 md:mr-4">in</span>
            <span className="contact-title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#e07b39] to-[#d4a853]">Touch</span>
          </h2>
          
          <p className="contact-subtitle text-[#fff9f0]/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            Let's create something transformative together
          </p>
        </div>

        <div className="contact-content grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-4 md:space-y-6">
            {/* Phone */}
            <div className="contact-card bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(224,123,57,0.4)] group cursor-pointer">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#e07b39] to-[#c06020] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 font-[family-name:var(--font-playfair)]">
                    Phone
                  </h3>
                  <a
                    href="tel:6301654700"
                    className="text-[#e07b39] text-lg md:text-xl hover:text-[#d4a853] transition-colors"
                  >
                    6301654700
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="contact-card bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(212,168,83,0.4)] group cursor-pointer">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#d4a853] to-[#c9a84c] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 font-[family-name:var(--font-playfair)]">
                    Email
                  </h3>
                  <a
                    href="mailto:rangved00@gmail.com"
                    className="text-[#d4a853] text-base md:text-xl hover:text-[#e5c578] transition-colors break-all"
                  >
                    rangved00@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="contact-card bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(201,120,86,0.4)] group cursor-pointer">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#c97856] to-[#b85c38] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 font-[family-name:var(--font-playfair)]">
                    Location
                  </h3>
                  <p className="text-[#fff9f0]/90 text-base md:text-xl">
                    Begumpet, Hyderabad
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 font-[family-name:var(--font-playfair)]">
              Send us a Message
            </h3>
            <form className="space-y-4 md:space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-white/90 font-semibold mb-2 text-sm md:text-base"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-[#e07b39] focus:bg-white/15 outline-none transition-all duration-300 text-sm md:text-base"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-white/90 font-semibold mb-2 text-sm md:text-base"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-[#d4a853] focus:bg-white/15 outline-none transition-all duration-300 text-sm md:text-base"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-white/90 font-semibold mb-2 text-sm md:text-base"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:border-[#e07b39] focus:bg-white/15 outline-none transition-all duration-300 resize-none text-sm md:text-base"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#e07b39] to-[#d4a853] text-white font-semibold rounded-lg md:rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#e07b39]/50 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
              >
                Send Message
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}