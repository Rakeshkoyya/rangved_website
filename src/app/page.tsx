"use client";

import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import AboutVision from "./components/AboutVision";
import Events from "./components/Events";
import ServicesNew from "./components/ServicesNew";
import WorkShowcase from "./components/WorkShowcase";
import LegacyTimeline from "./components/LegacyTimeline";
import FrameworkImpact from "./components/FrameworkImpact";
import FounderNew from "./components/FounderNew";
import TestimonialsNew from "./components/TestimonialsNew";
import ContactNew from "./components/ContactNew";
import FooterNew from "./components/FooterNew";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#faf7f2] text-[#2d1810]">
      <Navigation />
      <main>
        <Hero />
        <AboutVision />
        <Events />
        <ServicesNew />
        <WorkShowcase />
        <LegacyTimeline />
        <FrameworkImpact />
        <FounderNew />
        <TestimonialsNew />
        <ContactNew />
      </main>
      <FooterNew />
    </div>
  );
}
