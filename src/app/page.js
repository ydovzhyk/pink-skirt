import ContactSection from '@/components/contact/';
import VideoBanner from '@/components/video-banner/index';

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <VideoBanner type="top" id="top-banner" />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-4">

      <ContactSection />

      </div>
      <VideoBanner type="bottom" id="bottom-banner" />
    </div>
  );
}
