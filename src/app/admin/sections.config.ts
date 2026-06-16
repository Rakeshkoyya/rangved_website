export type SectionMode = "gallery" | "slots" | "single";

export type SectionConfig = {
  key: "hero" | "events" | "services" | "legacy" | "founder" | "logo";
  title: string;
  mode: SectionMode;
  dir: string; // folder under /images for newly uploaded files
  slotLabels?: string[];
  compress: { maxDimension: number; quality: number };
};

export const SECTIONS: SectionConfig[] = [
  { key: "hero", title: "Hero gallery", mode: "gallery", dir: "hero", compress: { maxDimension: 2400, quality: 0.82 } },
  { key: "events", title: "Events", mode: "gallery", dir: "events", compress: { maxDimension: 2000, quality: 0.82 } },
  {
    key: "services",
    title: "Services",
    mode: "slots",
    dir: "services",
    slotLabels: ["Theatre Arts", "Dance", "Annual Day & Corporate"],
    compress: { maxDimension: 2000, quality: 0.82 },
  },
  {
    key: "legacy",
    title: "Legacy timeline",
    mode: "slots",
    dir: "work_legacy",
    slotLabels: ["Corporate Productions", "School Productions", "Dance Performances"],
    compress: { maxDimension: 2000, quality: 0.82 },
  },
  { key: "founder", title: "Founder portrait", mode: "single", dir: "founder", compress: { maxDimension: 1400, quality: 0.85 } },
  { key: "logo", title: "Logo", mode: "single", dir: "founder", compress: { maxDimension: 800, quality: 0.95 } },
];
