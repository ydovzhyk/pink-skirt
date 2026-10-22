'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import Text from '../../shared/text/text';
import MarqueeQuote from '../../shared/marquee-quote/index';
import ImageModal from '../../shared/image-modal/index';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { CiZoomIn } from 'react-icons/ci';
import ActivePhotoMark from '../../shared/active-photo-mark';
import { slugify } from '@/utils/seo/public-url';
import Photo from '@/components/shared/photo';

const ReadyGoodsDetail = ({
  id,
  title,
  date,
  description,
  mainImageUrl,
  additionalImageUrls,
  details,
}) => {
  const [activeImage, setActiveImage] = useState(mainImageUrl);
  const allReadyGoods = useSelector(getAllReadyGoods);
  const router = useRouter();
  const screenType = useSelector(getScreenType);
  const currentIndex = allReadyGoods.findIndex(item => item.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < allReadyGoods.length - 1;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const imagesAll = [mainImageUrl, ...(additionalImageUrls || [])].filter(Boolean);
  const activeIndex = Math.max(0, imagesAll.indexOf(activeImage));

  const previousReadyGood = hasPrevious ? allReadyGoods[currentIndex - 1] : null;
  const nextReadyGood = hasNext ? allReadyGoods[currentIndex + 1] : null;
  const goodsHref = item =>
    `/ready-goods/${slugify(item.title) || item.id}/${item.id}`;

  const openModalAtActive = () => {
    const idx = Math.max(0, imagesAll.indexOf(activeImage));
    setModalIndex(idx);
    setIsModalOpen(true);
  };

  return (
    <section
      id="story-detail"
      className="relative container py-12 lg:py-16 flex flex-col gap-10 lg:gap-12"
    >
      <button
        onClick={() => router.back()}
        className="absolute top-5 left-0 flex items-center gap-2 px-3 py-2 text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
      >
        <RiArrowGoBackFill className="w-5 h-5" />
        <Text
          type="small"
          as="p"
          fontWeight="light"
          className="text-[var(--text-title)]"
        >
          Go back
        </Text>
      </button>

      <MarqueeQuote />

      {screenType === 'isMobile' && (
        <div className="text-center mt-[-20px]">
          <Text
            type="normal"
            as="h2"
            fontWeight="medium"
            className="text-black mb-5"
          >
            {title}
          </Text>
          <Text type="small" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2 mt-[-10px]">
        <div className="w-full aspect-square flex flex-row gap-4">
          {activeImage && (
            <div className="relative w-[65%] h-full rounded-md shadow-lg overflow-hidden">
              <Photo src={activeImage} title={title} index={activeIndex} />
              {screenType === 'isMobile' && (
                <button
                  type="button"
                  onClick={openModalAtActive}
                  aria-label="Zoom image"
                  className="absolute top-2 right-2 flex items-center justify-center"
                >
                  <span className="inline-flex items-center justify-center w-[50px] h-[50px] rounded-full bg-black/20 backdrop-blur-sm border border-gray-300">
                    <CiZoomIn className="w-7 h-7 text-white" />
                  </span>
                </button>
              )}
            </div>
          )}

          {additionalImageUrls.length > 0 && (
            <div className="w-[35%] h-full overflow-y-auto scroll-smooth thin-scrollbar pr-2 flex flex-col gap-4 overflow-hidden transition-all duration-200">
              {imagesAll.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className="relative flex-none w-full cursor-pointer overflow-hidden rounded-md shadow-lg border border-gray-300 my-[1px] mx-[1px]"
                  style={{ height: 'calc(50% - 0.65rem)' }}
                >
                  <Photo src={img} title={title} index={i} />
                  {activeImage === img && <ActivePhotoMark />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start items-start w-full gap-8">
          <div className="flex flex-col justify-center items-center">
            {screenType !== 'isMobile' && (
              <div className="text-center">
                <Text
                  type="normal"
                  as="h2"
                  fontWeight="medium"
                  className="text-black mb-5"
                >
                  {title}
                </Text>
                <Text
                  type="small"
                  as="p"
                  fontWeight="light"
                  className="text-black text-left"
                >
                  {new Date(date).toDateString()}
                </Text>
              </div>
            )}
          </div>
          <div
            className="w-full flex flex-col justify-start items-start gap-4"
            style={{ marginTop: screenType === 'isMobile' ? '-40px' : '0px' }}
          >
            <Text
              type="tiny"
              as="p"
              fontWeight="normal"
              lineHeight="normal"
              className="text-black"
            >
              Description:
            </Text>
            <Text
              type={
                screenType === 'isDesktop'
                  ? 'tiny'
                  : screenType === 'isTablet'
                    ? 'small'
                    : screenType === 'isMobile'
                      ? 'tiny'
                      : 'tiny'
              }
              as="p"
              fontWeight="light"
              lineHeight="snug"
              className="text-[var(--text-title)] whitespace-pre-line"
            >
              {description || 'No description available.'}
            </Text>
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="border-t border-gray-300 h-[1px] w-[90%]"></div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <div className="flex flex-col gap-1">
              <Text
                type="tiny"
                as="p"
                fontWeight="medium"
                lineHeight="normal"
                className="text-black"
              >
                Fabrication:
              </Text>
              <Text
                type={
                  screenType === 'isDesktop'
                    ? 'tiny'
                    : screenType === 'isTablet'
                      ? 'small'
                      : screenType === 'isMobile'
                        ? 'tiny'
                        : 'tiny'
                }
                as="p"
                fontWeight="light"
                lineHeight="snug"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                {`${details.fabrication || 'N/A'}`}
              </Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text
                type="tiny"
                as="p"
                fontWeight="medium"
                lineHeight="normal"
                className="text-black"
              >
                Colourway:
              </Text>
              <Text
                type={
                  screenType === 'isDesktop'
                    ? 'tiny'
                    : screenType === 'isTablet'
                      ? 'small'
                      : screenType === 'isMobile'
                        ? 'tiny'
                        : 'tiny'
                }
                as="p"
                fontWeight="light"
                lineHeight="snug"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                {`${details.colourway || 'N/A'}`}
              </Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text
                type="tiny"
                as="p"
                fontWeight="normal"
                lineHeight="normal"
                className="text-black"
              >
                Size:
              </Text>
              <Text
                type={
                  screenType === 'isDesktop'
                    ? 'tiny'
                    : screenType === 'isTablet'
                      ? 'small'
                      : screenType === 'isMobile'
                        ? 'tiny'
                        : 'tiny'
                }
                as="p"
                fontWeight="light"
                lineHeight="snug"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                {`${details.size || 'N/A'}`}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {previousReadyGood ? (
          <Link
            href={goodsHref(previousReadyGood)}
            aria-label={`Previous item: ${previousReadyGood.title}`}
            title={`Previous item: ${previousReadyGood.title}`}
            className="text-black border-b border-gray-400 hover:border-[var(--accent)] w-fit text-left transition-colors duration-200"
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Previous item
            </Text>
          </Link>
        ) : (
          <span className="text-black border-b border-gray-300 max-w-[46%] opacity-50">
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Previous item
            </Text>
          </span>
        )}
        {nextReadyGood ? (
          <Link
            href={goodsHref(nextReadyGood)}
            aria-label={`Next item: ${nextReadyGood.title}`}
            title={`Next item: ${nextReadyGood.title}`}
            className="text-black border-b border-gray-400 hover:border-[var(--accent)] w-fit text-right transition-colors duration-200"
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Next item
            </Text>
          </Link>
        ) : (
          <span className="text-black border-b border-gray-300 max-w-[46%] text-right opacity-50">
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Next item
            </Text>
          </span>
        )}
      </div>

      {isModalOpen && screenType === 'isMobile' && (
        <ImageModal
          images={imagesAll}
          initialIndex={modalIndex}
          title={title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default ReadyGoodsDetail;
