"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// WhatsApp click-to-chat: opens a chat with a prefilled message.
const WHATSAPP_NUMBER = "916301654700"; // 91 = India country code
const WHATSAPP_MESSAGE =
  "Hi Rangved! I'd like to know more about your performing arts and events services.";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
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

          {/* WhatsApp CTA */}
          <div className="contact-form flex flex-col justify-center bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-white/20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#25D366] to-[#1da851] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg mb-5 md:mb-6">
              <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 font-[family-name:var(--font-playfair)]">
              Message us directly
            </h3>
            <p className="text-[#fff9f0]/80 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              Have a question or a project in mind? Chat with us on WhatsApp and
              we&apos;ll get right back to you.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold rounded-lg md:rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#25D366]/50 flex items-center justify-center gap-3 cursor-pointer text-base md:text-lg"
            >
              <WhatsAppIcon className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}