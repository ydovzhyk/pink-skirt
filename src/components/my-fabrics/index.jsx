'use client';

import { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';
import { getFabrics } from '@/redux/fabrics/fabrics-operations';
import Text from '@/components/shared/text/text';
import FabricCard from './fabric-card';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const MyFabrics = () => {
  const dispatch = useDispatch();
  const fabricsData = useSelector(getAllFabrics);
  const randomRepRef = useRef(new Map());

  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const groups = useMemo(() => {
    const map = new Map();
    for (const f of fabricsData) {
      const normKey = (f?.name ?? '').trim().toLowerCase();
      if (!normKey) continue;
      if (!map.has(normKey)) {
        map.set(normKey, { key: normKey, displayName: f.name, items: [f] });
      } else {
        map.get(normKey).items.push(f);
      }
    }

    const result = [];
    for (const g of map.values()) {
      const cachedId = randomRepRef.current.get(g.key);
      let representative = g.items.find(i => i.id === cachedId);

      if (!representative) {
        const withPhoto = g.items.filter(
          i =>
            Array.isArray(i.imageUrls) && i.imageUrls.filter(Boolean).length > 0
        );
        const pool = withPhoto.length ? withPhoto : g.items;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        representative = pick;
        randomRepRef.current.set(g.key, pick.id);
      }

      result.push({
        key: g.key,
        displayName: representative.name,
        representative,
        items: g.items,
      });
    }
    return result;
  }, [fabricsData]);

  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollByAmount = 320;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (fabricsData.length === 0 && !isChecked) {
      dispatch(getFabrics());
      setIsChecked(true);
    }
  }, [dispatch, isChecked, fabricsData]);

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
      setTimeout(updateButtonVisibility, 300);
    }
  };

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onResizeOrScroll = () => updateButtonVisibility();

    const imgs = Array.from(slider.querySelectorAll('img'));
    let remaining = imgs.length;

    const done = () => {
      remaining -= 1;
      if (remaining <= 0) updateButtonVisibility();
    };

    if (imgs.length === 0) {
      updateButtonVisibility();
    } else {
      imgs.forEach(img => {
        if (img.complete) {
          done();
        } else {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        }
      });
    }

    slider.addEventListener('scroll', onResizeOrScroll);
    window.addEventListener('resize', onResizeOrScroll);
    return () => {
      slider.removeEventListener('scroll', onResizeOrScroll);
      window.removeEventListener('resize', onResizeOrScroll);
    };
  }, [groups]);

  if (!isAdmin && groups.length === 0) return null;

  return (
    <section
      id="fabrics"
      className="relative pt-12 pb-16 border border-transparent bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fabrics/fabric-bg.webp')" }}
    >
      <div className="absolute inset-0 bg-white opacity-0 z-0 pointer-events-none" />
      <div className="container relative flex flex-col items-center mt-8 gap-12">
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

        <div className="relative w-full overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
          >
            <div className="min-w-[300px] flex-shrink-0 rounded-md overflow-hidden border border-gray-300">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/fabrics/landing.webp')",
                }}
              />
            </div>

            {!isAdmin &&
              groups.map(g => (
                <div key={g.key} className="w-[300px] flex-none">
                  <FabricCard
                    id={g.representative.id}
                    fabricCategory={g.representative.name}
                    shortDescription={g.representative.shortDescription}
                    imageUrls={g.representative.imageUrls}
                  />
                </div>
              ))}

            {isAdmin &&
              fabricsData.map(g => (
                <div key={g.id} className="w-[300px] flex-none">
                  <FabricCard
                    id={g.id}
                    fabricCategory={g.name}
                    shortDescription={g.shortDescription}
                    imageUrls={g.imageUrls}
                    fabric={g}
                  />
                </div>
              ))}
          </div>

          {canScrollLeft && (
            <button
              className="group absolute top-1/2 left-5 transform -translate-y-1/2 z-10"
              aria-label="Scroll left"
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

          {canScrollRight && (
            <button
              className="group absolute top-1/2 right-5 transform -translate-y-1/2 z-10"
              aria-label="Scroll right"
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
};

export default MyFabrics;

