import type { MetadataRoute } from "next";
import { siteImages } from "@/content/manifest";

// Required for `output: "export"` (static HTML export).
export const dynamic = "force-static";

const SITE_URL = "https://www.rangvedtheatre.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/our-work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...siteImages.workCategories.map((c) => ({
      url: `${SITE_URL}/our-work/${c.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
