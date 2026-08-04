import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Toaster } from "sonner";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Viper Gears | Official Taekwondo Doboks & Sparring Gear India",
  description:
    "Strike With Precision. Shop WT Approved Taekwondo Uniforms (Dobok), Black Belt Competition Uniforms, Hogu, Headguards & Sparring Gear. Made in Chattarpur, Delhi.",
  keywords: [
    "Taekwondo Uniform India",
    "Taekwondo Dobok",
    "WT Approved Dobok",
    "Viper Gears",
    "Taekwondo Gear Delhi",
    "Taekwondo Black Belt Uniform",
  ],
  authors: [{ name: "Viper Gears India" }],
  openGraph: {
    title: "Viper Gears | Premium Taekwondo Uniforms & Armor India",
    description: "Ultra-Light 220 GSM Jacquard Ripstop Doboks. Made for Champions.",
    url: "https://vipergears.in",
    siteName: "Viper Gears",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Toaster position="bottom-left" theme="dark" richColors />
      </body>
    </html>
  );
}
