import type { ReactNode } from "react";
import Navigation from "../components/Navigation";
import FooterNew from "../components/FooterNew";

export default function OurWorkLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#faf7f2] text-[#2d1810]">
      <Navigation isSolid />
      <main>{children}</main>
      <FooterNew />
    </div>
  );
}
