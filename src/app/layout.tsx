import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaunchProof Studio — S&K Growth Command Centre",
  description:
    "LaunchProof Studio by Carter Digitals — Kabelo & Sihle's private growth command centre. Lead pipeline, outreach, revenue tracking, and partner workspaces. Most agencies sell promises. We sell proof.",
  keywords: ["LaunchProof Studio", "Carter Digitals", "Kabelo", "Sihle", "Pretoria", "Lead Dashboard", "Digital Agency"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
