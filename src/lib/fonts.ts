import { Inter, Roboto_Mono } from "next/font/google";

export const brandSans = Inter({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

export const brandMono = Roboto_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
});

export const fontVariablesClassName = `${brandSans.variable} ${brandMono.variable}`;
