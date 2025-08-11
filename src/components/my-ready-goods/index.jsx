'use client';

import { getReadyGoods } from '@/redux/ready-goods/ready-goods-operations';
import {
  getAllReadyGoods,
  getCurrentPageReadyGoods,
  getNewestReadyGoods,
  getReadyGoodsList,
  getTotalPagesReadyGoods,
} from '@/redux/ready-goods/ready-goods-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../shared/pagination';
import Text from '../shared/text/text';
import NewestReadyGoodCard from './newest-card';
import ReadyGoodCard from './ready-good-card';

function MyReadyGoods() {
  const dispatch = useDispatch();
  const readyGoods = useSelector(getReadyGoodsList);
  const allReadyGoods = useSelector(getAllReadyGoods);
  const newestReadyGoods = useSelector(getNewestReadyGoods);
  const totalPages = useSelector(getTotalPagesReadyGoods);
  const currentPage = useSelector(getCurrentPageReadyGoods);
  const readyGoodsRef = useRef(null);
  const screenType = useSelector(getScreenType);
  const isMobileOrTablet =
    screenType === 'isMobile' || screenType === 'isTablet';

  const newestGood =
    newestReadyGoods.length > 0
      ? newestReadyGoods[Math.floor(Math.random() * newestReadyGoods.length)]
      : null;

  useEffect(() => {
    const limit = isMobileOrTablet ? 4 : 6;
    dispatch(getReadyGoods({ page: currentPage, limit }));
  }, [dispatch, currentPage, isMobileOrTablet]);

  useEffect(() => {
  }, [readyGoods, totalPages, currentPage]);

  if (allReadyGoods.length === 0) {
    return null;
  }

  const firstRow = readyGoods.slice(0, 4);
  const secondRowLeft = readyGoods[4];
  const secondRowRight = readyGoods[5];

  return (
    <section
      ref={readyGoodsRef}
      id="collection"
      className="bg-white border border-transparent"
    >
      <div className="container mt-12 lg:mt-16">
        <div className="flex items-center justify-start relative my-12 lg:my-16">
          <div className="bg-[var(--section-first)] absolute left-0 w-fit p-2 px-5 rounded-md border border-gray-300">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase bg-[var(--section-first)]"
            >
              Collection
            </Text>
          </div>
          <span className="w-full border-t border-gray-400"></span>
        </div>

        {(screenType === 'isDesktop' || screenType === 'isLaptop') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {firstRow.map(item => (
              <div key={item.id}>
                <ReadyGoodCard {...item} readyGood={item} />
              </div>
            ))}
            <div>
              {secondRowLeft && (
                <ReadyGoodCard {...secondRowLeft} readyGood={secondRowLeft} />
              )}
            </div>
            <div
              className="col-span-2 h-full"
              style={{
                maxHeight: screenType === 'isLaptop' ? '400px' : '495px',
              }}
            >
              {newestGood && (
                <NewestReadyGoodCard {...newestGood} readyGood={newestGood} />
              )}
            </div>
            <div>
              {secondRowRight && (
                <ReadyGoodCard {...secondRowRight} readyGood={secondRowRight} />
              )}
            </div>
          </div>
        )}

        {(screenType === 'isMobile' || screenType === 'isTablet') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {readyGoods.slice(0, 2).map(item => (
              <ReadyGoodCard {...item} key={item.id} readyGood={item} />
            ))}

            {newestGood && (
              <div className="sm:col-span-2 aspect-[27/40]  sm:aspect-square">
                <NewestReadyGoodCard
                  {...newestGood}
                  key={newestGood.id}
                  readyGood={newestGood}
                />
              </div>
            )}

            {readyGoods.slice(2, 4).map(item => (
              <ReadyGoodCard {...item} key={item.id} readyGood={item} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="my-12 lg:my-16 flex justify-center">
            <Pagination
              totalPages={totalPages}
              type="ready-goods"
              scrollTargetId="collection"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default MyReadyGoods;
