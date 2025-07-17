// 'use client';

// const VerticalSlider = ({
//   images,
//   width = 400,
//   height = 600,
//   rounded = true,
//   spacing = 20,
// }) => {
//   const totalHeight = height + spacing;

//   return (
//     <div
//       className="snap-y snap-mandatory overflow-y-auto"
//       style={{
//         height: `${totalHeight}px`,
//         scrollSnapType: 'y mandatory',
//       }}
//     >
//       {images.map((src, index) => (
//         <div
//           key={index}
//           className={`snap-start flex items-center justify-center mx-auto ${
//             rounded ? 'rounded-md overflow-hidden' : ''
//           }`}
//           style={{
//             width: `${width}px`,
//             height: `${height}px`,
//             backgroundImage: `url(${src})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             marginBottom: `${spacing}px`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default VerticalSlider;

'use client';

import { useEffect, useRef, useState } from 'react';

const VerticalSlider = ({
  images,
  width = 595,
  height = 475,
  spacing = 20,
  rounded = true,
}) => {
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const totalHeight = images.length * (height + spacing);
  const visibleHeight = height + spacing;

  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Вираховуємо прогрес скролу ВНУТРІ секції
      const sectionTop = rect.top;
      const maxScroll = totalHeight - visibleHeight;
      const distanceScrolled = Math.min(Math.max(0, -sectionTop), maxScroll);

      setProgress(distanceScrolled);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [totalHeight, visibleHeight]);

  return (
    <div
      ref={wrapperRef}
      style={{
        height: `${totalHeight + visibleHeight}px`,
        position: 'relative',
      }}
    >
      {/* Sticky контейнер — віконце висотою 600px */}
      <div
        className="sticky top-0 flex justify-center items-start overflow-hidden"
        style={{ height: `${visibleHeight}px` }}
      >
        {/* Контейнер з усіма слайдами */}
        <div
          style={{
            transform: `translateY(-${progress}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                marginBottom: `${spacing}px`,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className={rounded ? 'rounded-md overflow-hidden' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalSlider;





