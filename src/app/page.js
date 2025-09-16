import ContactSection from '@/components/contact/';
import VideoBanner from '@/components/video-banner/index';
import AboutMe from '../components/about-me';
import MyStories from '../components/my-stories';
import MyReadyGoods from '../components/my-ready-goods';
import ImageBanner from '../components/shared/image-banner';
import MyModel from '../components/my-model';
import MyFabrics from '../components/my-fabrics';

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <VideoBanner
        type="top"
        id="top-banner"
        showAudioControls
        capToVideoAspect
        fallbackAspect={3/2}
      />
      <div className="w-full first-letter:flex flex-col items-center justify-center min-h-screen">
        <MyReadyGoods />
        <ImageBanner />
        <MyModel />
        <MyFabrics />
        <AboutMe />
        <ContactSection />
        <MyStories />
      </div>
      <VideoBanner type="bottom" id="bottom-banner" />
    </div>
  );
}
