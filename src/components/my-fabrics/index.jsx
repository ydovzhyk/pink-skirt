'use client';

import { useRef, useEffect, useState } from 'react';
import Text from '@/components/shared/text/text';
import FabricCard from './fabric-card';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

function MyFabrics() {
  const fabricsData = [
    {
      id: '1',
      name: 'Viscose',
      imageUrls: ['/images/fabrics/01.webp', '/images/fabrics/02.webp'],
    },
    {
      id: '2',
      name: 'Wool',
      imageUrls: ['/images/fabrics/03.webp', '/images/fabrics/04.webp'],
    },
    {
      id: '3',
      name: 'Silk',
      imageUrls: ['/images/fabrics/05.webp', '/images/fabrics/06.webp'],
    },
    {
      id: '4',
      name: 'Cotton',
      imageUrls: ['/images/fabrics/07.webp', '/images/fabrics/08.webp'],
    },
    {
      id: '5',
      name: 'Linen',
      imageUrls: ['/images/fabrics/09.webp', '/images/fabrics/010.webp'],
    },
    {
      id: '6',
      name: 'Polyester',
      imageUrls: ['/images/fabrics/011.webp', '/images/fabrics/012.webp'],
    },
    {
      id: '7',
      name: 'Cashmere',
      imageUrls: ['/images/fabrics/013.webp', '/images/fabrics/014.webp'],
    },
  ];
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollByAmount = 320;

  const updateButtonVisibility = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleScroll = direction => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollByAmount : scrollByAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateButtonVisibility();

    const handleScrollEvent = () => updateButtonVisibility();

    slider.addEventListener('scroll', handleScrollEvent);
    window.addEventListener('resize', updateButtonVisibility);

    return () => {
      slider.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('resize', updateButtonVisibility);
    };
  }, []);

  return (
    <section
      id="fabrics"
      className="relative pt-12 pb-16 border border-transparent bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fabrics/fabric-bg.webp')" }}
    >
      <div className="absolute inset-0 bg-white opacity-30 z-0 pointer-events-none" />
      <div className="container relative flex flex-col items-center mt-8 gap-12">
        {/* Section title */}
        <div className="relative w-full flex items-center justify-start mb-6">
          <span className="w-full border-t border-gray-300"></span>
          <div className="bg-[var(--section-first)] absolute right-0 w-fit p-2 px-5 rounded-md border border-gray-400">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase bg-[var(--section-first)]"
            >
              Fabrics
            </Text>
          </div>
        </div>

        {/* Slider block */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {/* FIRST STATIC IMAGE */}
            <div className="min-w-[300px] flex-shrink-0 rounded-md overflow-hidden border border-gray-300">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/fabrics/landing.webp')",
                }}
              />
            </div>

            {/* FABRIC CARDS */}
            {fabricsData.map(fabric => (
              <div key={fabric.id} className="min-w-[300px] flex-shrink-0">
                <FabricCard
                  id={fabric.id}
                  title={fabric.name}
                  imageUrls={fabric.imageUrls}
                />
              </div>
            ))}
          </div>

          {/* LEFT SCROLL BUTTON */}
          {canScrollLeft && (
            <button
              className="group absolute top-1/2 left-5 transform -translate-y-1/2 z-10"
              onClick={() => handleScroll('left')}
            >
              <div
                style={{ borderWidth: '0.5px' }}
                className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-white border-gray-300 transition-all duration-300 group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md"
              >
                <IoIosArrowBack className="text-gray-800 group-hover:text-[#e83894] transition-colors duration-300" />
              </div>
            </button>
          )}

          {/* RIGHT SCROLL BUTTON */}
          {canScrollRight && (
            <button
              className="group absolute top-1/2 right-5 transform -translate-y-1/2 z-10"
              onClick={() => handleScroll('right')}
            >
              <div
                style={{ borderWidth: '0.5px' }}
                className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-white border-gray-300 transition-all duration-300 group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md"
              >
                <IoIosArrowForward className="text-gray-800 group-hover:text-[#e83894] transition-colors duration-300" />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default MyFabrics;
