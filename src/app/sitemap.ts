import type { MetadataRoute } from "next";

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
  ];
}
