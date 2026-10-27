import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "./globals.css";
import { siteConfig } from "@/config/site.config";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Верификация Google — только если задана в site.config.ts
const googleVerify = siteConfig.analytics.googleSiteVerification.trim();
const configuredId = siteConfig.analytics.yandexMetrikaId.trim();
const yandexId = /^\d+$/.test(configuredId) ? configuredId : "";
const configuredGoogleAnalyticsId = siteConfig.analytics.googleAnalyticsId.trim();
const googleAnalyticsId = /^G-[A-Z0-9]+$/.test(configuredGoogleAnalyticsId) ? configuredGoogleAnalyticsId : "";

/* ──────────────────────────────────────
   МЕТАДАННЫЕ САЙТА (SEO + ВЕРИФИКАЦИЯ)
   Обновляются через site.config.ts
   ────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://evameilove.github.io"),
  title: siteConfig.profile.siteTitle,
  description: siteConfig.profile.siteDescription,
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png?v=3", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [{ url: "/icons/apple-touch-icon.png?v=3", sizes: "180x180" }],
  },
  openGraph: {
    title: siteConfig.profile.siteTitle,
    description: siteConfig.profile.siteDescription,
    url: "/",
    siteName: "Ева Мэй",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ева Мэй — личная страничка" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.profile.siteTitle,
    description: siteConfig.profile.siteDescription,
    images: ["/og-image.jpg"],
  },
  ...(googleVerify
    ? {
        verification: {
          google: googleVerify,
        },
      }
    : {}),
};

/* ──────────────────────────────────────
   КОРНЕВОЙ LAYOUT — обёртка для всего сайта
   ────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">
        <LanguageProvider>
          <LanguageSwitcher />
          {children}

          {googleAnalyticsId ? (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
              <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              ` }} />
            </>
          ) : null}

          {/* Яндекс.Метрика — только если в site.config указан номер счётчика */}
          {yandexId ? (
            <>
              <Script
                id="yandex-metrika"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                  __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.webvisor.org/metrika/tag_ww.js?id=${yandexId}','ym');

              ym(${yandexId}, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: "dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce: true,
                trackLinks: true
              });
            `,
                }}
              />

            </>
          ) : null}
        </LanguageProvider>
      </body>
    </html>
  );
}

