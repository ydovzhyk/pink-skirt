'use client';

import { useState, useEffect, useRef } from 'react';
import Text from '@/components/shared/text/text';
import ModelCard from './model-card';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

const modelItems = [
  {
    id: 'model-1',
    title: 'Flamingo Fantasy',
    media: [
      '/images/model/art.space.pavlova-0001.jpg',
      '/images/model/art.space.pavlova-0002.jpg',
      '/images/model/art.space.pavlova-0003.mp4',
    ],
    description:
      'An elegant flamingo dress inspired by the refined world of haute couture fashion.',
  },
  {
    id: 'model-2',
    title: 'Velvet Garden',
    media: [
      '/images/model/art.space.pavlova-0004.mp4',
      '/images/model/art.space.pavlova-0005.jpg',
      '/images/model/art.space.pavlova-0006.jpg',
      '/images/model/art.space.pavlova-0007.jpg',
    ],
    description:
      'Soft velvet combined with floral elegance for a graceful, timeless look',
  },
  {
    id: 'model-3',
    title: 'Monochrome Vibes',
    media: [
      '/images/model/art.space.pavlova-0008.jpg',
      '/images/model/art.space.pavlova-0009.jpg',
      '/images/model/art.space.pavlova--00010.mp4',
    ],
    description: 'Minimalistic and sharp look.',
  },
];

function MyModel() {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };

    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + modelItems.length) % modelItems.length);
  };

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % modelItems.length);
  };

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000); // 5 секунд
  };

  const stopAutoplay = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const visibleItems = [];
  for (let i = 0; i < cardsToShow; i++) {
    const index = (startIndex + i) % modelItems.length;
    visibleItems.push(modelItems[index]);
  }

  return (
    <section
      id="models"
      className="py-12 lg:py-16 border border-transparent"
      style={{
        background: `linear-gradient(to bottom, rgba(250, 247, 195, 0.3), var(--section-fourth))`,
      }}
    >
      <div className="container relative flex flex-col items-center gap-8 lg:gap-16">
        {/* Заголовок */}
        <div className="flex items-center">
          <span className="w-24 border-t border-gray-400" />
          <span className="bg-[var(--section-first)] w-fit p-2 px-5 rounded-md border border-gray-300">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase rotate-90 p-1 px-5"
            >
              Models
            </Text>
          </span>
          <span className="w-24 border-t border-gray-400" />
        </div>

        {/* Слайдер */}
        <div
          ref={containerRef}
          className="w-full flex items-center justify-center gap-4 relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {/* Кнопка вліво */}
          <button className="group absolute left-0 z-10" onClick={handlePrev}>
            <div
              style={{ borderWidth: '0.5px' }}
              className="w-[50px] h-[50px] flex flex-row items-center justify-center group-hover:gap-3 rounded-full bg-white border-gray-300 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
            >
              <div className="ml-[-3px] text-gray-800 group-hover:text-[#e83894] transition-colors duration-300">
                <IoIosArrowBack />
              </div>
            </div>
          </button>

          {/* Картки */}
          <div className="flex gap-6 justify-center w-full max-w-[1200px] px-10">
            {visibleItems.map(item => (
              <div key={item.id} className="flex-1 min-w-0">
                <ModelCard model={item} />
              </div>
            ))}
          </div>

          {/* Кнопка вправо */}
          <button className="group absolute right-0 z-10" onClick={handleNext}>
            <div
              style={{ borderWidth: '0.5px' }}
              className="w-[50px] h-[50px] flex flex-row items-center justify-center group-hover:gap-3 rounded-full bg-white border-gray-300 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
            >
              <div className="mr-[-2px] text-gray-800 group-hover:text-[#e83894] transition-colors duration-300">
                <IoIosArrowForward />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default MyModel;
