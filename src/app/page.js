import ContactSection from '@/components/contact/';
import VideoBanner from '@/components/hero/index';

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <VideoBanner />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4">
        <ContactSection />
      </div>
    </div>
  );
}
