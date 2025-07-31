'use client';

import Text from '../text/text';

const ImageBanner = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[350px] lg:h-[500px] flex flex-row border-t border-b border-gray-200">
      {/* Ліва частина */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/image-banner/banner01.webp')",
        }}
      ></div>

      {/* Права частина */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/image-banner/banner02.webp')",
        }}
      ></div>

      {/* Текст по центру банера */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-[300px]">
          <Text
            type="title"
            as="p"
            fontWeight="normal"
            className="text-[#4C4C4C] text-center"
            textShadow="white"
          >
            Enduring charm, playfully modern
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ImageBanner;
