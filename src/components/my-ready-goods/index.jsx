'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReadyGoods } from '@/redux/ready-goods/ready-goods-operations';
import {
  getReadyGoodsList,
  getTotalPagesReadyGoods,
  getCurrentPageReadyGoods,
  getNewestReadyGoods,
  getAllReadyGoods,
} from '@/redux/ready-goods/ready-goods-selectors';
import Text from '../shared/text/text';
import ReadyGoodCard from './ready-good-card';
import Pagination from '../shared/pagination';
import NewestReadyGoodCard from './newest-card';

function MyReadyGoods() {
  const dispatch = useDispatch();
  const readyGoods = useSelector(getReadyGoodsList);
  const allReadyGoods = useSelector(getAllReadyGoods);
  const newestReadyGoods = useSelector(getNewestReadyGoods);
  const totalPages = useSelector(getTotalPagesReadyGoods);
  const currentPage = useSelector(getCurrentPageReadyGoods);
  const readyGoodsRef = useRef(null);

  const newestGood =
    newestReadyGoods.length > 0
      ? newestReadyGoods[Math.floor(Math.random() * newestReadyGoods.length)]
      : null;

  useEffect(() => {
    dispatch(getReadyGoods({ page: currentPage, limit: 6 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
  }, [readyGoods]);

  if (allReadyGoods.length === 0) {
    return null;
  }

  const firstRow = readyGoods.slice(0, 4);
  const secondRowLeft = readyGoods[4];
  const secondRowRight = readyGoods[5];

  return (
    <div className="bg-white border border-transparent">
      <section
        ref={readyGoodsRef}
        id="ready-goods"
        className={`container mt-12 lg:mt-16 ${
          totalPages > 1 ? 'lg:mb-[104px]' : 'lg:mb-[64px]'
        }`}
      >
        <div className="flex items-center justify-start relative my-12 lg:my-16">
          <div className="bg-[var(--section-first)] absolute left-0 w-fit px-5 py-3 rounded-md border border-white">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase rotate-90 p-2 px-5 bg-[var(--section-first)]"
            >
              Ready Goods
            </Text>
          </div>
          <span
            className="w-full bg-[#1a1443]"
            style={{ height: '0.5px' }}
          ></span>
        </div>
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
          <div className="col-span-2 h-full">
            {newestGood && <NewestReadyGoodCard {...newestGood} readyGood={newestGood} />}
          </div>
          <div>
            {secondRowRight && (
              <ReadyGoodCard {...secondRowRight} readyGood={secondRowRight} />
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-[70px] mb-[-40px] flex justify-center">
            <Pagination totalPages={totalPages} type="ready-goods" />
          </div>
        )}
      </section>
    </div>
  );
}

export default MyReadyGoods;
