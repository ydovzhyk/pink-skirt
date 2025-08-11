'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getReadyGoods } from '@/redux/ready-goods/ready-goods-operations';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getStories } from '@/redux/stories/stories-operations';
import { getModels } from '@/redux/models/models-operations';
import { getModelsList } from '@/redux/models/models-selectors';
import Text from '../../shared/text/text';
import MarqueeQuote from '../../shared/marquee-quote/index';
import ImageModal from '../../shared/image-modal/index';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { CiZoomIn } from 'react-icons/ci';

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
  const dispatch = useDispatch();
  const allStories = useSelector(getAllStories);
  const allModels = useSelector(getModelsList);
  const screenType = useSelector(getScreenType);

  const currentIndex = allReadyGoods.findIndex(item => item.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allReadyGoods.length - 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const imagesAll = [mainImageUrl, ...(additionalImageUrls || [])];

  useEffect(() => {
    if (allReadyGoods.length === 0) {
      dispatch(getReadyGoods({ page: 1, limit: 2 }));
    }

    if (allStories.length === 0) {
      dispatch(getStories({ page: 1, limit: 2 }));
    }

    if (allModels.length === 0) {
      dispatch(getModels());
    }
  }, [dispatch, allReadyGoods.length, allStories.length, allModels.length]);

  const handleNavigate = (title, id) => {
    const formattedTitle = (title || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    router.push(`/ready-goods/${formattedTitle}/${id}`);
  };

  const handlePreviousItem = () => {
    const previousReadyGood = allReadyGoods[currentIndex - 1];
    if (previousReadyGood) {
      handleNavigate(previousReadyGood.title, previousReadyGood.id);
    }
  };

  const handleNextItem = () => {
    const nextReadyGood = allReadyGoods[currentIndex + 1];
    if (nextReadyGood) {
      handleNavigate(nextReadyGood.title, nextReadyGood.id);
    }
  };

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
          {/* Основне фото */}
          {activeImage && (
            <div className="relative w-[65%] h-full rounded-md shadow-lg overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${activeImage})` }}
              />
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

          {/* Вертикальний слайдер */}
          {additionalImageUrls.length > 0 && (
            <div className="w-[35%] h-full overflow-y-auto scroll-smooth thin-scrollbar pr-2 flex flex-col gap-4">
              {[mainImageUrl, ...additionalImageUrls].map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`flex-none w-full bg-cover bg-center cursor-pointer rounded-md shadow-lg border-[1.5px] ${
                    activeImage === img
                      ? 'border-[var(--accent)]'
                      : 'border-transparent'
                  }`}
                  style={{
                    backgroundImage: `url(${img})`,
                    height: 'calc(50% - 0.5rem)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Опис */}
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
        <button
          onClick={handlePreviousItem}
          disabled={!hasPrevious}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasPrevious
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Previous item
          </Text>
        </button>
        <button
          onClick={handleNextItem}
          disabled={!hasNext}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasNext
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Next item
          </Text>
        </button>
      </div>

      {/* Modal for zoomed image */}
      {isModalOpen && screenType === 'isMobile' && (
        <ImageModal
          images={imagesAll}
          initialIndex={modalIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default ReadyGoodsDetail;
