"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".contact-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-cards",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="contact-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Get in Touch
          </span>
          <h2 className="contact-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Create Impact With Rangved
          </h2>
          <p className="contact-heading text-lg text-cream/60 max-w-2xl mx-auto">
            Step Into the Spotlight With Us
          </p>
        </div>

        {/* Contact Cards */}
        <div className="contact-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="tel:6301654700"
            className="contact-card group p-8 rounded-2xl bg-charcoal/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <Phone className="text-saffron-light" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">Call Us</h3>
            <p className="text-gold text-xl font-bold">6301654700</p>
          </a>

          <a
            href="mailto:rangved00@gmail.com"
            className="contact-card group p-8 rounded-2xl bg-charcoal/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <Mail className="text-saffron-light" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">Email Us</h3>
            <p className="text-gold text-sm font-medium break-all">
              rangved00@gmail.com
            </p>
          </a>

          <div className="contact-card group p-8 rounded-2xl bg-charcoal/50 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="text-saffron-light" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">Visit Us</h3>
            <p className="text-cream/60 text-sm">Begumpet, Hyderabad</p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-saffron/20 via-gold/10 to-saffron/20 border border-gold/20 text-center">
          <p className="text-xl md:text-2xl text-cream/90 leading-relaxed mb-6 font-[family-name:var(--font-playfair)] italic">
            "Together, we can create transformative theatre experiences that
            empower young minds and build confident, creative individuals."
          </p>
          <a
            href="https://www.youtube.com/@Rangved"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron to-saffron-light text-background font-semibold rounded-full hover:shadow-xl hover:shadow-saffron/20 transition-all duration-300 hover:-translate-y-1"
          >
            Watch Our Latest Work
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
