import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

// Optimized Title (51 chars - ideal 50-60) & Description (147 chars - ideal 120-160)
export const metadata: Metadata = {
  metadataBase: new URL("https://studyfreepdf.com"),
  title: "StudyFree PDF | Bihar Notes & NEP-2020 Internships",
  description: "Download Bihar & Central exam topper notes, solved PYQs, and enroll in accredited UGC NEP-2020 virtual internships by DDIS. Start learning today!",
  alternates: {
    canonical: "https://studyfreepdf.com",
  },
  verification: {
    google: "RMKbrn10l7PioPdqYzzis4OjgvK9CpRdOzOOm_LbYNA",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "StudyFree PDF | Bihar Notes & NEP-2020 Internships",
    description: "Download Bihar & Central exam topper notes, solved PYQs, and enroll in accredited UGC NEP-2020 virtual internships by DDIS. Start learning today!",
    url: "https://studyfreepdf.com",
    siteName: "StudyFree PDF",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyFree PDF | Bihar Notes & NEP-2020 Internships",
    description: "Download Bihar & Central exam topper notes, solved PYQs, and enroll in accredited UGC NEP-2020 virtual internships by DDIS. Start learning today!",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://studyfreepdf.com/#organization",
      "name": "StudyFree PDF",
      "alternateName": "Digital Developer Infinity Solution (DDIS)",
      "url": "https://studyfreepdf.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://studyfreepdf.com/logo.png",
        "width": 512,
        "height": 512
      },
      "slogan": "Talent Aapka, Rasta Hamara (टैलेंट आपका, रास्ता हमारा)",
      "description": "Bihar & India's leading digital vault for topper notes, solved PYQs, and UGC NEP-2020 accredited virtual college internships.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Near Zero Mile Metro Station",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "800007",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7544065425",
        "contactType": "customer support",
        "email": "studyfreepdf2@gmail.com",
        "areaServed": "IN",
        "availableLanguage": ["Hindi", "English"]
      },
      "sameAs": [
        "https://www.facebook.com/studyfreepdf",
        "https://www.linkedin.com/company/digital-developer-infinity-solution",
        "https://www.digitalinfinityddis.com"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://studyfreepdf.com/#website",
      "url": "https://studyfreepdf.com",
      "name": "StudyFree PDF",
      "publisher": {
        "@id": "https://studyfreepdf.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://studyfreepdf.com/explore?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification Meta Tag */}
        <meta name="google-site-verification" content="RMKbrn10l7PioPdqYzzis4OjgvK9CpRdOzOOm_LbYNA" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Tag Manager (GTM-PKDVWCW4) */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-PKDVWCW4"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />

        {/* Meta Pixel (Facebook Pixel) */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1359482025192837');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#00A389] selection:text-white">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PKDVWCW4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1359482025192837&ev=PageView&noscript=1"
            alt="Facebook Pixel"
          />
        </noscript>

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
