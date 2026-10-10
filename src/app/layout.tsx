import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart/cart-context';
import { AuthProvider } from '@/lib/auth/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Utsav Ghar | Bring Home the Light of Diwali - Premium Indian Festive Store',
  description: 'Shop handcrafted brass Lakshmi Ganesh idols, traditional clay diyas, festive fairy lights, engraved puja thalis, and luxury Diwali gift hampers.',
  keywords: ['Diwali shopping', 'brass idols', 'clay diyas', 'Diwali gifts', 'Indian handicrafts', 'puja thali set', 'Utsav Ghar'],
  openGraph: {
    title: 'Utsav Ghar | Bring Home the Light of Diwali',
    description: 'Authentic Indian Diwali store specializing in artisanal brass idols, earthen lamps, and curated gift hampers.',
    url: 'https://utsavghar.com',
    siteName: 'Utsav Ghar',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-[#141416] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
