"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Bravo! Your talent and commitment made every moment special — truly grateful for your contribution.",
    author: "Principal, Gitanjali Group of Schools",
    role: "2024",
  },
  {
    quote:
      "Thank you, Rithik sir, for your incredible guidance. We shine today because of you — excited to learn and perform more with you!",
    author: "Nithya, 10th Student",
    role: "2025",
  },
  {
    quote:
      "An outstanding mentor! Your ability to train our young students so effectively in a short time is remarkable. We look forward to many more summer camps and workshops together.",
    author: "Chairman, Walker Town Academy",
    role: "2024",
  },
  {
    quote:
      "Heartfelt thanks to Rithik for his detailed guidance and direction. Applause to our young artists — your hard work truly shone!",
    author: "Event Organiser",
    role: "2025",
  },
  {
    quote:
      "Dear Sir, Thank you for helping me overcome my stage fear. I'll truly miss dramatics — you were a teacher and a friend.",
    author: "Amayra, Grade 6th",
    role: "2024",
  },
  {
    quote:
      "Dear Rithik Sir, Thank you for your guidance, trust, and encouragement. This journey has been truly enriching, and we'll always value the lessons and memories gained.",
    author: "Educator",
    role: "2025",
  },
  {
    quote:
      "Thank you, sir, for training my child so well. He would excitedly share his learnings every day — truly grateful for your support.",
    author: "Parent",
    role: "2023",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-heading",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-maroon/5 to-background" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="testimonials-heading inline-block text-gold text-sm tracking-[0.3em] uppercase mb-4">
            What People Say
          </span>
          <h2 className="testimonials-heading text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] text-cream mb-6">
            Testimonials
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="p-8 md:p-12 rounded-2xl bg-charcoal/50 border border-gold/10 text-center">
                <Quote
                  className="text-gold/30 mx-auto mb-6"
                  size={40}
                  strokeWidth={1}
                />
                <p className="text-xl md:text-2xl text-cream/90 leading-relaxed mb-8 font-[family-name:var(--font-playfair)] italic">
                  "{testimonials[current].quote}"
                </p>
                <div>
                  <p className="text-gold font-semibold text-lg">
                    {testimonials[current].author}
                  </p>
                  <p className="text-cream/50 text-sm">
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-gold w-8"
                    : "bg-gold/30 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
