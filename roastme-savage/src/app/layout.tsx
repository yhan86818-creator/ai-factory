import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "RoastMe Savage — Brutal AI Burn Generator",
  description: "The most savage AI on the internet. Upload a bio or photo and get roasted instantly. Sharp, witty, and absolutely zero mercy.",
  keywords: ["AI Roast", "RoastMe", "Funny AI", "AI Burn", "Savage AI", "Viral AI App"],
  openGraph: {
    title: "RoastMe Savage — Brutal AI Burn Generator",
    description: "The most savage AI on the internet. Get burned instantly.",
    type: "website",
    url: "https://roastme-savage.pages.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMe Savage — Brutal AI Burn Generator",
    description: "The most savage AI on the internet. Get burned instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
