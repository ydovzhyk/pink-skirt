'use client';

import Image from 'next/image';

const HorizontalSlider = ({
  images,
  width = 300,
  height = 450,
  rounded = true,
  spacing = 'space-x-4',
}) => {
  return (
    <div
      className={`w-full overflow-x-scroll no-scrollbar snap-x snap-mandatory flex ${spacing}`}
    >
      {images.map((src, index) => (
        <div
          key={index}
          className="min-w-[80%] snap-start flex-shrink-0 flex items-center justify-center"
        >
          <Image
            src={src}
            width={width}
            height={height}
            alt={`Slide ${index + 1}`}
            className={`object-cover ${rounded ? 'rounded-lg' : ''}`}
          />
        </div>
      ))}
    </div>
  );
};

export default HorizontalSlider;
