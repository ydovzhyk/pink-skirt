'use client';

import Text from '@/components/shared/text/text';
import { useEffect, useRef, useState } from 'react';
function AboutMe() {
  const images = [
    '/images/about-slider/01.webp',
    '/images/about-slider/02.webp',
    '/images/about-slider/03.webp',
    '/images/about-slider/04.webp',
  ];

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

  return (
    <div id="about-me">
      <section
        ref={scrollRef}
        className="py-12 lg:py-16 flex flex-col gap:12 lg:gap-16 items-center bg-[var(--section-second)]"
        style={{
          height: `${totalScroll + visibleHeight}px`,
        }}
      >
        <div className="flex items-center">
          <span
            className="w-24 bg-[#1a1443]"
            style={{ height: '0.5px' }}
          ></span>
          <span className="bg-[var(--section-first)] w-fit p-2 px-5 rounded-md border border-[#c9cec6]">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase rotate-90 p-1 px-5 bg-[var(--section-first)]"
            >
              ABOUT ME
            </Text>
          </span>
          <span
            className="w-24 bg-[#1a1443]"
            style={{ height: '0.5px' }}
          ></span>
        </div>

        <div
          id="about"
          className="container sticky top-[110px] lg:h-[490px] flex flex-row justify-between gap-8 lg:gap-16"
        >
          <div className="flex flex-col justify-center items-start w-[40%]">
            <Text
              type="normal"
              as="p"
              fontWeight="normal"
              className="text-black mb-5"
            >
              My Insight
            </Text>
            <Text
              type="normal"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)] mb-5"
            >
              Some things can’t be taught or forced — style is one of them. It’s
              not just what you wear; it’s how you feel, how you move, how you
              connect with the moment. Style flows with you, breathes through
              you, and quietly becomes part of your inner world
            </Text>
            <Text
              type="normal"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)]"
            >
              Inspired by slow mornings, sunlit streets, deep thoughts, and the
              quiet confidence of simplicity, our collections are designed not
              to impress — but to resonate. To wrap you in ease. To remind you
              of who you are when you’re most at peace.
            </Text>
          </div>

          <div className="w-[60%] h-full relative">
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
      </section>
    </div>
  );
}
export default AboutMe;
