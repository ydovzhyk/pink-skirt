'use client';

import Text from '../shared/text/text';
import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';

const VideoBanner = ({ type = 'top', id }) => {
  const screenType = useSelector(getScreenType);
  const videoSrc =
    type === 'top' ? '/video/banner-top.mp4' : '/video/banner-bottom.mp4';
  const heightClasses =
    type === 'top'
      ? 'h-[500px] sm:h-[500px] md:h-[580px]'
      : 'h-[450px] sm:h-[400px] md:h-[450px]';

  return (
    <section
      id={id}
      className={`w-full ${heightClasses} overflow-hidden relative`}
    >
      <video
        className="w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      {type === 'top' && (
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1280px] px-4 flex flex-col gap-4"
            style={{
              bottom:
                screenType === 'isDesktop'
                  ? '100px'
                  : '85px'
            }}
          >
            <Text
              type="tiny"
              as="p"
              fontWeight="light"
              className="text-[#FAFCFF]"
              textShadow="black"
            >
              Explore my collection
            </Text>
            <div
              style={{
                width:
                  screenType === 'isMobile'
                    ? '80%'
                    : screenType === 'isTablet'
                      ? '65%'
                      : screenType === 'isLaptop'
                        ? '45%'
                        : '45%',
              }}
            >
              <Text
                type="title"
                as="p"
                fontWeight="normal"
                className="text-[#FAFCFF]"
                textShadow="black"
              >
                Relaxed simplicity, timeless appeal and a touch of modern
                whimsy.
              </Text>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoBanner;
