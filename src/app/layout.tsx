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

export const metadata: Metadata = {
  title: "Rangved | Theatre, Events & Experiences That Inspire Change",
  description:
    "Rangved is a theatre movement born in Hyderabad in 2023. We direct compelling theatre-driven events, organize workshops, productions & creative programs. Rooted in Indian theatrical traditions, shaped by modern pedagogy.",
  keywords: [
    "Rangved",
    "theatre",
    "Hyderabad",
    "events",
    "workshops",
    "drama therapy",
    "mime",
    "street theatre",
    "annual day",
    "corporate events",
    "theatre education",
  ],
  authors: [{ name: "Rangved" }],
  openGraph: {
    title: "Rangved | Theatre, Events & Experiences That Inspire Change",
    description:
      "Rangved is a theatre movement born in Hyderabad in 2023. We direct compelling theatre-driven events, organize workshops, productions & creative programs.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
