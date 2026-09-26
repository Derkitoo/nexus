import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "BJJ Nexus - Tactical GPS",
  description: "Système de navigation dynamique Action-Réaction pour le Jiu-Jitsu Brésilien.",
  manifest: "manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BJJ Nexus"
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-black text-white antialiased selection:bg-[#0a84ff] selection:text-white min-h-screen">
        <main className="tactical-viewport-container flex flex-col">
          {children}
        </main>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
