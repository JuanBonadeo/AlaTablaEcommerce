import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://alatabla.store'),
  title: {
    default: 'A la Tabla - Todo para tu asado',
    template: '%s | A la Tabla'
  },
  description: 'Descubre artesanías únicas en madera hechas a mano. Tablas de cortar, utensilios de cocina y productos artesanales de alta calidad.',
  keywords: ['artesanías', 'madera', 'tablas de cortar', 'cocina', 'artesanal', 'productos de madera', 'decoración'],
  authors: [{ name: 'A la Tabla' }],
  creator: 'A la Tabla',
  publisher: 'A la Tabla',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    title: 'A la Tabla - Todo para tu asado',
    description: 'Descubre artesanías únicas en madera hechas a mano. Tablas de cortar, utensilios de cocina y productos artesanales de alta calidad.',
    siteName: 'A la Tabla',
    images: [{
      url: '/logo.png',
      width: 800,
      height: 600,
      alt: 'A la Tabla Logo'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A la Tabla - Todo para tu asado',
    description: 'Descubre artesanías únicas en madera hechas a mano.',
    images: ['/logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen  text-white bg-black">
            
          
            {children}

          
          
        </div>
        <WhatsAppButton />
      </body>
    </html>
  );
}
