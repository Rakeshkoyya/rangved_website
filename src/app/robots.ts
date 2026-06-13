import type { MetadataRoute } from "next";

// Required for `output: "export"` (static HTML export).
export const dynamic = "force-static";

const SITE_URL = "https://www.rangvedtheatre.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
