'use client';

import { useEffect, useState } from 'react';
import { HiOutlineArrowsExpand, HiOutlineX } from 'react-icons/hi';

const MAPS_HREF = 'https://maps.app.goo.gl/v3SjQJRuz45qsr957';
const MAP_SRC =
  'https://maps.google.com/maps?q=Pink%20Skirt%2C%20Brooklands%20Ave%2C%20Cambridge%20CB2%208DG&ll=52.19155,0.1282208&z=16&output=embed&t=m';

const AtelierMap = () => {
  const [loaded, setLoaded] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const section = document.getElementById('atelier-map');
    if (!section) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!full) return;

    const onKeyDown = event => {
      if (event.key === 'Escape') setFull(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [full]);

  return (
    <section
      id="atelier-map"
      aria-label="Pink Skirt on the map"
      className="relative h-[320px] w-full overflow-hidden bg-[var(--section-first)] md:h-[420px] lg:h-[460px]"
    >
      <div className={full ? 'fixed inset-0 z-[70] bg-white' : 'absolute inset-0'}>
        {loaded ? (
          <iframe
            title="Pink Skirt, Brooklands Ave, Cambridge"
            src={MAP_SRC}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-[5] hidden h-full w-[60%] -translate-x-1/2 lg:block"
        />
        <button
          type="button"
          onClick={() => {
            setLoaded(true);
            setFull(open => !open);
          }}
          aria-label={full ? 'Close map' : 'Open map fullscreen'}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md transition hover:text-black"
        >
          {full ? (
            <HiOutlineX className="h-5 w-5" />
          ) : (
            <HiOutlineArrowsExpand className="h-5 w-5" />
          )}
        </button>
        <a
          href={MAPS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm text-gray-700 shadow-md transition hover:text-black"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
};

export default AtelierMap;
