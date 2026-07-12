import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NestRGU - Student Accommodation Discovery",
  description: "Verified student housing around Rajiv Gandhi University, Doimukh. Skip broker drama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#000000] font-sans selection:bg-black/10 selection:text-black">
        {/* Premium visual layers */}
        <div className="grain-overlay" />
        <div className="soft-vignette" />
        
        {/* Fixed Header */}
        <Navbar />
        
        {/* Main layout container */}
        <main className="flex-grow flex flex-col relative z-10">{children}</main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
