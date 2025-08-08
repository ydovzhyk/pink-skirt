'use client';

import { useRouter } from 'next/navigation';
import Text from '../text/text';
import { getSections } from '../../header/navigation/navigation';

const ImageBanner = () => {
  const sections = getSections();
  const router = useRouter();

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = section?.offset;

    router.push(`/#${id}`);

    setTimeout(() => {
      const element = document.getElementById(id);

      if (element && yOffset !== undefined) {
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  return (
    <div className="relative w-full h-[580px] flex flex-row border-t border-b border-gray-200">
      <div
        className="hidden md:block w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/image-banner/banner01.webp')",
        }}
      ></div>
      <div
        className="w-full md:w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/image-banner/banner02.webp')",
        }}
      ></div>
      <div className="absolute inset-0 flex items-end md:items-center justify-center px-4 pb-12 md:pb-0">
        <div className="max-w-[300px] flex flex-col items-center gap-10">
          <Text
            type="banner"
            as="p"
            fontWeight="light"
            className="text-[#010101ea] text-center"
            textShadow="white"
          >
            Enduring charm, playfully modern
          </Text>
          <button
            className="group"
            role="button"
            onClick={() => handleNavigate('contacts')}
          >
            <div
              style={{ borderWidth: '0.5px' }}
              className="flex items-center gap-1 group-hover:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-md bg-white border-gray-300 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md w-full btn-shine uppercase"
            >
              <Text
                type="small"
                as="span"
                fontWeight="light"
                className="text-[var(--text-title)]"
              >
                Contact Me
              </Text>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageBanner;
