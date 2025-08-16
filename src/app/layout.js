import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { StoreProvider } from '@/redux/store-provider';
import { LanguageProvider } from '@/utils/translating/language-context';
import ClientLayout from './client-layout';
import GaPageviews from '@/utils/GaPageviews';
import '../app/css/globals.css';

export const metadata = {
  title: 'Pink Skirt – Bespoke Women’s Clothing by Inna Kuzmuk',
  description:
    'Pink Skirt – a unique atelier by Inna Kuzmuk, specializing in bespoke women’s clothing. Elegant, high-quality designs created with passion in the UK.',
  openGraph: {
    title: 'Pink Skirt – Bespoke Women’s Clothing by Inna Kuzmuk',
    description:
      'Discover Pink Skirt – a studio in a new format by Inna Kuzmuk. Handmade bespoke women’s clothing, tailored with precision and love.',
    url: 'https://pinkskirt.uk',
    siteName: 'Pink Skirt Atelier',
    images: [
      {
        url: 'https://pinkskirt.uk/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pink Skirt Atelier – bespoke women’s clothing by Inna Kuzmuk',
      },
    ],
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pink Skirt – Bespoke Women’s Clothing by Inna Kuzmuk',
    description:
      'Elegant bespoke women’s clothing by Pink Skirt Atelier. Tailor-made with precision, style, and passion.',
    images: ['https://pinkskirt.uk/og-image.png'],
  },
  keywords: [
    'Pink Skirt',
    'Pink Skirt Atelier',
    'Inna Kuzmuk',
    'Інна Кузьмук',
    'bespoke clothing',
    'bespoke womenswear',
    'custom women’s clothing',
    'tailor-made dresses',
    'custom dresses UK',
    'made to measure clothing',
    'tailored skirts',
    'evening dresses bespoke',
    'wedding guest dresses',
    'luxury womenswear',
    'atelier London',
    'UK clothing atelier',
    'handmade dresses',
    'couture dresses',
    'high end fashion UK',
    'luxury fabrics',
    'premium fabrics clothing',
    'handcrafted clothing',
    'designer dresses UK',
    'sustainable fashion UK',
    'жіночий одяг на замовлення',
    'ательє жіночого одягу',
    'пошиття суконь на замовлення',
    'одяг з натуральних тканин',
    'ексклюзивний жіночий одяг',
    'індивідуальний пошив одягу',
    'вишуканий жіночий одяг',
    'дизайнерський одяг',
    'пошив спідниць на замовлення',
    'пошив вечірніх суконь',
    'сукні на випускний на замовлення',
    'сукні для особливих подій',
  ],
  authors: [{ name: 'Inna Linnik', url: 'https://pinkskirt.uk' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <LanguageProvider>
            {/* gtag.js */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
          `}
            </Script>
            <GaPageviews />

            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
