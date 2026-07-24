import type { Metadata } from "next";
import { Oxanium, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Display — heavy squared techno face, closest free stand-in for Korataki ExtraBold.
const oxanium = Oxanium({
  variable: "--font-display-src",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Body — matches the source (DM Sans).
const dmSans = DM_Sans({
  variable: "--font-sans-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ankit Dularia — Personal Portfolio",
  description:
    "Explore my portfolio of intuitive design solutions, innovative interfaces, and user-centered experiences. Specializing in impactful, accessible designs for web and mobile apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${dmSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
