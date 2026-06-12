"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Legacy", href: "#legacy" },
  { label: "Founder", href: "#founder" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 border-b border-[#e07b39]/10 shadow-sm"
            : "bg-transparent"
        }`}
        style={{
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex flex-col items-start group">
              <div className="relative h-10 w-32 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/founder/rangved.png"
                  alt="Rangved Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <span className={`text-[10px] uppercase tracking-[0.25em] ml-0.5 transition-colors duration-500 ${scrolled ? "text-[#e07b39]" : "text-white/70"}`}>
              Arts and Events
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm transition-colors duration-300 py-2 group hover:text-[#e07b39] ${
                    scrolled ? "text-[#4a3428]" : "text-white/90"
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e07b39] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2.5 bg-gradient-to-r from-[#e07b39] to-[#f0a060] text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-[#e07b39]/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get in Touch
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 transition-colors hover:text-[#e07b39] ${
                scrolled ? "text-[#2d1810]" : "text-white/90"
              }`}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#faf7f2]/98 pt-24 px-6 lg:hidden"
            style={{
              WebkitBackdropFilter: "blur(20px)",
              backdropFilter: "blur(20px)",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-[family-name:var(--font-playfair)] text-[#2d1810] hover:text-[#e07b39] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#e07b39] to-[#f0a060] text-white text-center font-medium rounded-full"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
