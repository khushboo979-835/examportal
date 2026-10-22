import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: "StudyFreePDF.com | Notes Marketplace & NEP-2020 DDIS Virtual Internships",
  description: "Download verified topper notes, 10-year solved PYQs, and enroll in UGC/NEP-2020 accredited undergraduate virtual internships certified under Digital Developer Infinity Solution (DDIS).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#00A389] selection:text-white">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
