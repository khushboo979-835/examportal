import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import MegaMenu from "@/components/navigation/MegaMenu";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: "ExamPass.in | India's #1 Dedicated PDF Marketplace for Exam Notes & Solved Papers",
  description: "Download verified topper handwritten notes, 10-year solved PYQs, and formula sheets for CBSE, Bihar Board (BSEB), BPSC 70th CCE, UPSC CSE, SSC CGL & MCA semesters with instant dynamic watermarking.",
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
          <MegaMenu />
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
