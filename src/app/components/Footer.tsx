"use client";

import { Phone, Mail, MapPin, Video, Camera } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Legacy", href: "#legacy" },
  { label: "Framework", href: "#framework" },
  { label: "Impact", href: "#impact" },
  { label: "Founder", href: "#founder" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden border-t border-gold/10">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-background font-bold text-lg font-[family-name:var(--font-playfair)]">
                R
              </div>
              <div>
                <span className="text-xl font-bold text-cream font-[family-name:var(--font-playfair)]">
                  Rangved
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-gold/70">
                  Event Management
                </span>
              </div>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">
              A theatre movement born in Hyderabad in 2023. Rooted in Indian
              aesthetics, shaping confident, creative individuals through the
              power of performance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-semibold mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream/50 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-cream font-semibold mb-6 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              <li className="text-cream/50 text-sm">Corporate Events</li>
              <li className="text-cream/50 text-sm">Social Events</li>
              <li className="text-cream/50 text-sm">Educational Events</li>
              <li className="text-cream/50 text-sm">Cultural & Entertainment</li>
              <li className="text-cream/50 text-sm">Private Events</li>
              <li className="text-cream/50 text-sm">Local/Small Events</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-semibold mb-6 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:6301654700"
                  className="flex items-center gap-3 text-cream/50 hover:text-gold transition-colors text-sm"
                >
                  <Phone size={16} />
                  6301654700
                </a>
              </li>
              <li>
                <a
                  href="mailto:rangved00@gmail.com"
                  className="flex items-center gap-3 text-cream/50 hover:text-gold transition-colors text-sm"
                >
                  <Mail size={16} />
                  rangved00@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream/50 text-sm">
                <MapPin size={16} />
                Begumpet, Hyderabad
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6">
              <p className="text-cream/50 text-xs mb-3">Follow us @rangved_events</p>
              <div className="flex gap-3">
                <a
                  href="https://www.youtube.com/@Rangved"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-charcoal/50 border border-gold/10 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/30 transition-all"
                >
                  <Video size={18} />
                </a>
                <a
                  href="https://www.instagram.com/rangved_events"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-charcoal/50 border border-gold/10 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/30 transition-all"
                >
                  <Camera size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-sm">
            &copy; {new Date().getFullYear()} Rangved. All rights reserved.
          </p>
          <p className="text-cream/30 text-xs">
            Theatre, Events & Experiences That Inspire Change
          </p>
        </div>
      </div>
    </footer>
  );
}
