'use client';

import Text from '@/components/shared/text/text';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
function AboutMe() {
  const screenType = useSelector(getScreenType);
  const images = [
    '/images/about-slider/01.webp',
    '/images/about-slider/02.webp',
    '/images/about-slider/03.webp',
    '/images/about-slider/04.webp',
  ];

  // Mobile version horizontal slider
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

const handleScroll = direction => {
  if (!sliderRef.current) return;
  const scrollAmount = 300;

  if (direction === 'left') {
    sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

useEffect(() => {
  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  checkScroll();
  const ref = sliderRef.current;
  ref?.addEventListener('scroll', checkScroll);
  return () => ref?.removeEventListener('scroll', checkScroll);
}, []);

  // End of mobile version horizontal slider

  // Desktop version vertical slider
  const scrollRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const imageHeight = 480;
  const visibleHeight = 500;
  const totalScroll = (images.length - 1) * imageHeight;

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const start = window.innerHeight - visibleHeight;
      const maxScroll = totalScroll;

      if (rect.top <= start && rect.bottom >= visibleHeight) {
        const scrollY = Math.min(Math.abs(rect.top - start), maxScroll);
        setOffset(scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalScroll]);

  // End of desktop version vertical slider

  return (
    <>
      {screenType !== 'isMobile' && (
        <section className="relative bg-[var(--section-second)] border border-transparent">
          <div id="about-me" className="absolute -top-[0px] h-[1px] w-full" />
          <div
            ref={scrollRef}
            className="py-12 lg:py-16 flex flex-col gap-10 lg:gap-12 items-center"
            style={{
              height: `${totalScroll + visibleHeight}px`,
            }}
          >
            <div className="flex items-center mt-[-20px]">
              <span className="w-24 border-t border-gray-400"></span>
              <span className="bg-[var(--section-first)] w-fit p-2 px-5 rounded-md border border-gray-300">
                <Text
                  type="regular"
                  as="span"
                  fontWeight="normal"
                  className="text-[#e83894] uppercase rotate-90 p-1 px-5 bg-[var(--section-first)]"
                >
                  ABOUT ME
                </Text>
              </span>
              <span className="w-24 border-t border-gray-400"></span>
            </div>

            <div
              id="about-me-content"
              className="container sticky top-[110px] lg:h-[490px] flex flex-row justify-between gap-8 lg:gap-16"
            >
              <div className="flex flex-col justify-center items-start gap-10 w-[40%]">
                <Text
                  type="normal"
                  as="p"
                  fontWeight="normal"
                  className={'text-black'}
                >
                  My Insight
                </Text>
                <Text
                  type={
                    screenType === 'isDesktop'
                      ? 'tiny'
                      : screenType === 'isTablet'
                        ? 'small'
                        : screenType === 'isMobile'
                          ? 'tiny'
                          : 'normal'
                  }
                  as="p"
                  fontWeight="light"
                  lineHeight="normal"
                  className="text-[var(--text-title)] whitespace-pre-line"
                >
                  Some things can’t be taught or forced — style is one of them.
                  It’s not just what you wear; it’s how you feel, how you move,
                  how you connect with the moment. Style flows with you,
                  breathes through you, and quietly becomes part of your inner
                  world.
                </Text>
                <Text
                  type={
                    screenType === 'isDesktop'
                      ? 'tiny'
                      : screenType === 'isTablet'
                        ? 'small'
                        : screenType === 'isMobile'
                          ? 'tiny'
                          : 'normal'
                  }
                  as="p"
                  fontWeight="light"
                  lineHeight="normal"
                  className="text-[var(--text-title)] whitespace-pre-line"
                >
                  Inspired by slow mornings, sunlit streets, deep thoughts, and
                  the quiet confidence of simplicity, our collections are
                  designed not to impress — but to resonate. To wrap you in
                  ease. To remind you of who you are when you’re most at peace.
                </Text>
              </div>

              <div className="w-full md:w-[60%] h-[500px] md:h-full relative">
                <div className="absolute top-0 right-0 w-full h-full flex items-start overflow-hidden">
                  <div
                    className="w-full flex flex-col items-end gap-5"
                    style={{
                      transform: `translateY(-${offset}px)`,
                      transition: 'transform 0.05s linear',
                    }}
                  >
                    {images.map((src, index) => (
                      <div
                        key={index}
                        style={{
                          width: '100%',
                          maxWidth: '650px',
                          height: `${imageHeight}px`,
                          backgroundImage: `url(${src})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                        className="rounded-md overflow-hidden"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-section="about-me"
            className="absolute bottom-0 h-[1px] w-full pointer-events-none"
          />
        </section>
      )}

      {screenType === 'isMobile' && (
        <section
          id="about-me"
          className="relative bg-[var(--section-second)] py-12 lg:py-16"
        >
          <div className="container flex flex-col gap-10 lg:gap-12 items-center">
            <div className="flex items-center my-[-20px]">
              <span className="max-w-24 min-w-10 border-t border-gray-400"></span>
              <span className="bg-[var(--section-first)] w-fit p-2 px-5 rounded-md border border-gray-300">
                <Text
                  type="regular"
                  as="span"
                  fontWeight="normal"
                  className="text-[#e83894] uppercase rotate-90 p-1 px-5 bg-[var(--section-first)]"
                >
                  ABOUT ME
                </Text>
              </span>
              <span className="max-w-24 min-w-10 border-t border-gray-400"></span>
            </div>

            <div className="w-full flex flex-col items-start gap-10">
              <Text
                type="normal"
                as="p"
                fontWeight="normal"
                className="text-black text-left mb-[-10px]"
              >
                My Insight
              </Text>
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                lineHeight="normal"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                Some things can’t be taught or forced — style is one of them.
                It’s not just what you wear; it’s how you feel, how you move,
                how you connect with the moment. Style flows with you, breathes
                through you, and quietly becomes part of your inner world.
              </Text>
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                lineHeight="normal"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                Inspired by slow mornings, sunlit streets, deep thoughts, and
                the quiet confidence of simplicity, our collections are designed
                not to impress — but to resonate. To wrap you in ease. To remind
                you of who you are when you’re most at peace.
              </Text>
            </div>

            {/* HORIZONTAL SLIDER */}
            <div className="relative w-full">
              {/* Buttons */}
              {canScrollLeft && (
                <button
                  className="group absolute top-1/2 left-2 transform -translate-y-1/2 z-10"
                  onClick={() => handleScroll('left')}
                >
                  <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white border border-gray-300 group-hover:shadow-md">
                    <IoIosArrowBack className="text-gray-800 group-hover:text-[#e83894]" />
                  </div>
                </button>
              )}
              {canScrollRight && (
                <button
                  className="group absolute top-1/2 right-2 transform -translate-y-1/2 z-10"
                  onClick={() => handleScroll('right')}
                >
                  <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white border border-gray-300 group-hover:shadow-md">
                    <IoIosArrowForward className="text-gray-800 group-hover:text-[#e83894]" />
                  </div>
                </button>
              )}

              {/* Image Scroll Area */}
              <div
                ref={sliderRef}
                className="w-full flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
              >
                {images.map((src, index) => (
                  <div
                    key={index}
                    className="min-w-[310px] h-[270px] flex-shrink-0 rounded-md bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
export default AboutMe;
