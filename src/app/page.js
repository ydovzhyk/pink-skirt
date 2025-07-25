import ContactSection from '@/components/contact/';
import VideoBanner from '@/components/video-banner/index';
import AboutMe from '../components/about-me';
import MyStories from '../components/my-stories';

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <VideoBanner type="top" id="top-banner" />
      <div className="w-full first-letter:flex flex-col items-center justify-center min-h-screen">
        <AboutMe />
        <ContactSection />
        <MyStories />
      </div>
      <VideoBanner type="bottom" id="bottom-banner" />
    </div>
  );
}
