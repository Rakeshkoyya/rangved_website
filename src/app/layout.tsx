import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.rangvedtheatre.in";

const DESCRIPTION =
  "Rangved is a Hyderabad-based event management and performing arts company — corporate, school, cultural & social events, theatre workshops, dance, drama therapy and annual day productions.";

// Keyword set supplied by the client (primary + category + local SEO terms).
const KEYWORDS = [
  // Primary
  "Event Management Company Hyderabad",
  "Corporate Event Management Hyderabad",
  "School Event Management Hyderabad",
  "Educational Event Organizers Hyderabad",
  "Cultural Event Management Hyderabad",
  "Creative Event Management Company",
  "Performing Arts Organization Hyderabad",
  "Theatre Arts Company Hyderabad",
  "Annual Day Productions Hyderabad",
  "Corporate Workshops Hyderabad",
  // Event management
  "Event Management Hyderabad",
  "Corporate Events",
  "Social Events",
  "Educational Events",
  "Cultural Events",
  "Entertainment Events",
  "Community Events",
  "Private Events",
  "Wedding Event Management",
  "Stage Design and Production",
  "Event Planning and Execution",
  "Live Event Production",
  // Theatre & performing arts
  "Performing Arts",
  "Theatre Arts",
  "Theatre Workshops for Schools",
  "Theatre Curriculum Programs",
  "Drama Classes Hyderabad",
  "Acting Workshops Hyderabad",
  "Mime Workshops",
  "Street Theatre Performances",
  "Children's Theatre Programs",
  "Theatre-Based Learning",
  "Drama Therapy",
  "Performing Arts Training",
  "Creative Arts Education",
  // Dance & movement
  "Western Dance Classes Hyderabad",
  "Classical Dance Programs",
  "School Dance Workshops",
  "Dance Choreography for Annual Day",
  "Dance Workshops for Children",
  // School & college
  "Annual Day Productions",
  "Summer Camps Hyderabad",
  "Personality Development for Students",
  "Communication Skills Through Theatre",
  "Hobby Classes for Schools",
  "Corporate Workshops",
  "Team Building Activities",
  "Experiential Learning",
  // Local
  "Event Organizers in Hyderabad",
  "Theatre Arts Hyderabad",
  "Dance Workshops Hyderabad",
  "Performing Arts Hyderabad",
  "Rangved",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Rangved | Event Management & Performing Arts Company in Hyderabad",
    template: "%s | Rangved",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: "Rangved",
  authors: [{ name: "Rangved" }],
  creator: "Rangved",
  publisher: "Rangved",
  category: "Event Management",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Rangved | Event Management & Performing Arts Company in Hyderabad",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Rangved",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero/1.JPG",
        alt: "Rangved — performing arts and events in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Rangved | Event Management & Performing Arts Company in Hyderabad",
    description: DESCRIPTION,
    images: ["/images/hero/1.JPG"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/images/founder/rangved.png",
    apple: "/images/founder/rangved.png",
  },
};

// Schema.org structured data (LocalBusiness + WebSite) for rich results & local SEO.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "PerformingGroup"],
      "@id": `${SITE_URL}/#organization`,
      name: "Rangved",
      alternateName: "Rangved Arts and Events",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/founder/rangved.png`,
      image: `${SITE_URL}/images/hero/1.JPG`,
      description: DESCRIPTION,
      slogan: "Theatre, Events & Experiences That Inspire Change",
      email: "rangved00@gmail.com",
      telephone: "+91-6301654700",
      foundingDate: "2023",
      founder: { "@type": "Person", name: "Rithik Thakur" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Begumpet",
        addressRegion: "Hyderabad, Telangana",
        addressCountry: "IN",
      },
      areaServed: { "@type": "City", name: "Hyderabad" },
      knowsAbout: KEYWORDS,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Rangved Services",
        itemListElement: [
          "Corporate Event Management",
          "School & Educational Event Management",
          "Cultural & Entertainment Events",
          "Wedding & Social Events",
          "Theatre Workshops & Curriculum for Schools",
          "Acting, Mime & Street Theatre Programs",
          "Western & Classical Dance Workshops",
          "Annual Day Productions",
          "Corporate Workshops & Team Building",
          "Summer Camps & Hobby Classes",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Rangved",
      description: DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
