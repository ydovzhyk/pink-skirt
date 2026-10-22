'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getModelsList } from '@/redux/models/models-selectors';
import { getModels } from '@/redux/models/models-operations';
import Text from '@/components/shared/text/text';
import ModelCard from './model-card';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { getScreenType } from '@/redux/technical/technical-selectors';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
const warmedMedia = new Set();
const warmedNodes = [];

function preloadModelPhoto(url) {
  if (!url || warmedMedia.has(url)) return;
  warmedMedia.add(url);
  const clean = url.split('?')[0].toLowerCase();
  const isVideo = VIDEO_EXTENSIONS.some(ext => clean.endsWith(ext));
  if (isVideo) {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.src = url;
    video.load();
    warmedNodes.push(video);
    return;
  }
  const img = new Image();
  img.src = url;
  warmedNodes.push(img);
}

const MyModel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const modelItems = useSelector(getModelsList);
  const screenType = useSelector(getScreenType);

  useEffect(() => {
    dispatch(getModels());
  }, [dispatch]);

  useEffect(() => {
    switch (screenType) {
      case 'isTablet':
        setCardsToShow(2);
        break;
      case 'isLaptop':
      case 'isDesktop':
        setCardsToShow(3);
        break;
      default:
        setCardsToShow(1);
    }
  }, [screenType]);

  const handlePrev = () => {
    if (modelItems.length === 0) return;
    setStartIndex(prev => (prev - 1 + modelItems.length) % modelItems.length);
  };

  const handleNext = () => {
    if (modelItems.length === 0) return;
    setStartIndex(prev => (prev + 1) % modelItems.length);
  };

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const stopAutoplay = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  useEffect(() => {
    if (modelItems.length === 0) return;
    const coming = [
      (startIndex + cardsToShow) % modelItems.length,
      (startIndex - 1 + modelItems.length) % modelItems.length,
    ];
    coming.forEach(index => {
      preloadModelPhoto(modelItems[index]?.media?.[0]);
    });
  }, [modelItems, startIndex, cardsToShow]);

  const visibleItems = [];
  if (modelItems.length > 0) {
    for (let i = 0; i < cardsToShow; i++) {
      const index = (startIndex + i) % modelItems.length;
      const item = modelItems[index];
      if (item) visibleItems.push(item);
    }
  }

  if (modelItems.length === 0) {
    return null;
  }

  return (
    <section
      id="models"
      className="pt-12 pb-16 border border-transparent"
      style={{
        background: `linear-gradient(to bottom, rgba(250, 247, 195, 0.3), var(--section-fourth))`,
      }}
    >
      <div className="container relative flex flex-col items-center gap-12">
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

        <div
          ref={containerRef}
          className="w-full flex items-center justify-center gap-4 relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <button className="group absolute left-5 z-10" onClick={handlePrev}>
            <div
              style={{ borderWidth: '0.5px' }}
              aria-label="Previous slide"
              className="w-[50px] h-[50px] flex flex-row items-center justify-center group-hover:gap-3 rounded-full bg-white border-gray-300 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
            >
              <div className="ml-[-3px] text-gray-800 group-hover:text-[#e83894] transition-colors duration-300">
                <IoIosArrowBack />
              </div>
            </div>
          </button>

          <div className="flex gap-6 justify-center w-full">
            {visibleItems.map(item => (
              <div key={item.id} className="w-full h-full">
                <ModelCard model={item} />
              </div>
            ))}
          </div>

          <button
            className="group absolute right-5 z-10"
            aria-label="Next slide"
            onClick={handleNext}
          >
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
  };

export default MyModel;