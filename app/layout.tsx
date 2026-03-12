import type { Metadata } from 'next';
import { Inter, Outfit, Bebas_Neue, Orbitron } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const orbitron = Orbitron({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-orbitron' });

const mechanical = localFont({
  src: '../public/font/Mechanical FREE.otf',
  variable: '--font-mechanical',
  display: 'swap',
});

const montserrat = localFont({
  src: [
    {
      path: '../public/font/Montserrat-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../public/font/Montserrat-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/font/Montserrat-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/font/Montserrat-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/font/Montserrat-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Team Staraptor CUET | VTOL Drone Engineering Team',
  description: 'Team Staraptor CUET is the first VTOL UAV design team from Chittagong University of Engineering & Technology (CUET), Bangladesh.',
  keywords: [
    'CUET drone team',
    'Bangladesh UAV team',
    'VTOL drone Bangladesh',
    'student UAV team',
    'CUET aerospace team',
    'VTOL competition METU',
    'Team Staraptor CUET',
    'UAV design CUET',
    'Aerospace engineering Bangladesh'
  ],
  verification: {
    google: 'nVC8dNC7shQBmqHSNyw0eeuuwH7C5bMr3Y9raq8JJxk',
  },
  openGraph: {
    title: 'Team Staraptor CUET | VTOL Drone Engineering Team',
    description: 'Team Staraptor CUET is the first VTOL UAV design team from Chittagong University of Engineering & Technology (CUET), Bangladesh.',
    url: 'https://staraptorcuet.vercel.app',
    siteName: 'Team Staraptor CUET',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Staraptor CUET | VTOL Drone Engineering Team',
    description: 'Team Staraptor CUET is the first VTOL UAV design team from Chittagong University of Engineering & Technology (CUET), Bangladesh.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${bebas.variable} ${orbitron.variable} ${montserrat.variable} ${mechanical.variable} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Team Staraptor CUET",
              "url": "https://staraptorcuet.vercel.app",
              "logo": "https://staraptorcuet.vercel.app/icon.png",
              "description": "VTOL UAV design team from Chittagong University of Engineering & Technology (CUET), Bangladesh.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Bangladesh"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}
