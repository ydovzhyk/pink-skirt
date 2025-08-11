'use client';

import { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ImageModal = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goPrev = e => {
    e?.stopPropagation?.();
    setCurrentIndex(i => (i - 1 + images.length) % images.length);
  };

  const goNext = e => {
    e?.stopPropagation?.();
    setCurrentIndex(i => (i + 1) % images.length);
  };

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-white/40 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
        >
          ✕
        </button>

        {images.length > 1 && (
          <>
            <button
              className="group absolute left-3 z-10"
              aria-label="Previous"
              onClick={goPrev}
            >
              <div
                style={{ borderWidth: '0.5px' }}
                className="w-[50px] h-[50px] flex flex-row items-center justify-center group-hover:gap-3 rounded-full bg-white border-gray-300 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md btn-shine uppercase"
              >
                <div className="ml-[-3px] text-gray-800 group-hover:text-[#e83894] transition-colors duration-300">
                  <IoIosArrowBack />
                </div>
              </div>
            </button>
            <button
              className="group absolute right-3 z-10"
              aria-label="Next"
              onClick={goNext}
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
          </>
        )}

        <img
          src={images[currentIndex]}
          alt="Zoomed view"
          className="max-w-[92vw] max-h-[85vh] object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ImageModal;
