import type { Metadata, Viewport } from "next";
import { Elms_Sans, Modern_Antiqua } from "next/font/google";
import "./globals.css";

const elmsSans = Elms_Sans({
  variable: "--font-default",
  subsets: ["latin"],
  display: "swap",
});

const modernAntiqua = Modern_Antiqua({
  weight: "400", // Modern Antiqua has only 400 weight
  variable: "--font-crux-title",
  subsets: ["latin"],
  display: "swap",
});

// Exporting for potential use in other components if needed, though not directly used in layout.
export { elmsSans, modernAntiqua };


export const viewport: Viewport = {
  themeColor: '#059669',
};

export const metadata: Metadata = {
  title: "Crux | Draw Your Fate",
  description: "Where intuition meets chance. A sleek, duotone companion for tarot readings and TTRPG sessions. Your next move starts here.",
  themeColor: '#059669',
  openGraph: {
    title: "Crux | Draw Your Fate",
    description: "Where intuition meets chance. A sleek, duotone companion for tarot readings and TTRPG sessions. Your next move starts here.",
    url: "https://crux.qtqwill.dev", // Assuming a deployment URL for the new JDR app
    siteName: "Crux | Draw Your Fate",
    type: "website",
    images: [{ url: '/favicon-32x32.png', width: 32, height: 32, alt: 'Crux Favicon' }],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Default font for the entire application
}>) {
  return (
    <html
      lang="en" // Apply default font and crux title font variables to the html tag
      className={`${elmsSans.variable} ${modernAntiqua.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
