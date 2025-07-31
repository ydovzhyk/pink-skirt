'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getReadyGoods } from '@/redux/ready-goods/ready-goods-operations';
import Text from '../../shared/text/text';
import MarqueeQuote from '../../shared/marquee-quote/index';

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

  const currentIndex = allReadyGoods.findIndex(item => item.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allReadyGoods.length - 1;

  useEffect(() => {
    if (allReadyGoods.length === 0) {
      dispatch(getReadyGoods({ page: 1, limit: 2 }));
    }
  }, [dispatch, allReadyGoods.length]);

  const handleNavigate = (title, id) => {
    const formattedTitle = title
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

  return (
    <section id="story-detail" className="container my-12 flex flex-col gap-10">
      <MarqueeQuote />
      <div className="grid gap-10 md:grid-cols-2 mt-[-10px]">
        <div className="w-full aspect-square flex flex-row gap-4">
          {/* Основне фото */}
          {activeImage && (
            <div
              className="w-[65%] h-full bg-cover bg-center rounded-md shadow-lg"
              style={{ backgroundImage: `url(${activeImage})` }}
            />
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
            <div className="text-center">
              <Text
                type="normal"
                as="p"
                fontWeight="normal"
                className="text-black mb-5"
              >
                {title}
              </Text>
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-black text-left"
              >
                {new Date(date).toDateString()}
              </Text>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <Text
              type="small"
              as="p"
              fontWeight="medium"
              lineHeight="normal"
              className="text-black"
            >
              Description:
            </Text>
            <Text
              type="small"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)] whitespace-pre-line"
            >
              {description}
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
                type="tiny"
                as="p"
                fontWeight="normal"
                lineHeight="normal"
                className="text-[var(--text-title)]"
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
                type="tiny"
                as="p"
                fontWeight="medium"
                lineHeight="normal"
                className="text-[var(--text-title)]"
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
                type="tiny"
                as="p"
                fontWeight="normal"
                lineHeight="normal"
                className="text-[var(--text-title)]"
              >
                {`${details.size || 'N/A'}`}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Навігація між постами */}
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
    </section>
  );
};

export default ReadyGoodsDetail;
