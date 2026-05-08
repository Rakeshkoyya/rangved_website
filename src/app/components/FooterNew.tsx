"use client";

import { Share2, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function FooterNew() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#e8d5c4] to-[#d4a853] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="relative h-16 w-48">
                <Image
                  src="/images/founder/rangved.png"
                  alt="Rangved Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-[#4a3428] text-lg leading-relaxed mb-6">
              A theatre movement transforming lives through performance,
              education, and creative experiences.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300"
                aria-label="Social Media"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300"
                aria-label="Social Media"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center text-[#e07b39] hover:bg-[#e07b39] hover:text-white transition-all duration-300"
                aria-label="Social Media"
              >
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-2xl font-bold text-[#2d1810] mb-6 font-[family-name:var(--font-playfair)]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  Our Work
                </a>
              </li>
              <li>
                <a
                  href="#legacy"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  Legacy
                </a>
              </li>
              <li>
                <a
                  href="#founder"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  Founder
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#4a3428] text-lg hover:text-[#e07b39] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-2xl font-bold text-[#2d1810] mb-6 font-[family-name:var(--font-playfair)]">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[#4a3428] text-lg">
                <Phone size={20} className="text-[#e07b39]" />
                <a href="tel:6301654700" className="hover:text-[#e07b39] transition-colors">
                  6301654700
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#4a3428] text-lg">
                <Mail size={20} className="text-[#e07b39] mt-1" />
                <a
                  href="mailto:rangved00@gmail.com"
                  className="hover:text-[#e07b39] transition-colors break-all"
                >
                  rangved00@gmail.com
                </a>
              </li>
              <li className="text-[#4a3428] text-lg">
                <span className="text-[#e07b39] font-semibold">Location:</span>
                <br />
                Begumpet, Hyderabad
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#4a3428]/20 pt-8 text-center">
          <p className="text-[#4a3428] text-lg">
            © {currentYear} <span className="font-semibold text-[#e07b39]">Rangved</span>. All rights reserved.
            <br />
            <span className="text-base">Transforming lives through theatre and creative experiences</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
