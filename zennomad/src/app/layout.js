import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZenNomad — Global Tax & Visa Optimizer for Digital Nomads",
  description: "Calculate your potential tax savings and find the best digital nomad visas across 50+ countries. 100% private, local-first logic.",
  keywords: ["digital nomad", "tax optimization", "nomad visa", "remote work", "tax calculator", "beckham law", "portugal nhr"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
