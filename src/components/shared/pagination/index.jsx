'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPageStories } from '@/redux/stories/stories-slice';
import { getCurrentPageStories } from '@/redux/stories/stories-selectors';
import { setCurrentPageReadyGoods } from '@/redux/ready-goods/ready-goods-slice';
import { getCurrentPageReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import Text from '../text/text';

const Pagination = ({ totalPages, type }) => {
  console.log('Pagination type:', type);
  console.log('Total pages:', totalPages);
  const dispatch = useDispatch();
  const currentPageStories = useSelector(getCurrentPageStories);
  const currentPageReadyGoods = useSelector(getCurrentPageReadyGoods);

  const currentPage =
    type === 'ready-goods' ? currentPageReadyGoods : currentPageStories;

  const handleChange = page => {
    if (page >= 1 && page <= totalPages) {
      if (type === 'ready-goods') {
        dispatch(setCurrentPageReadyGoods(page));
      } else {
        console.log('Setting current page for stories:', page);
        dispatch(setCurrentPageStories(page));
      }
    }
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text type="tiny" as="p" fontWeight="light">
          Prev
        </Text>
      </button>
      <div className="flex flex-row gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`flex flex-row justify-center items-center w-[30px] h-[36px] outline-none rounded ${
              currentPage === i + 1
                ? 'font-bold border border-black'
                : 'text-gray-600'
            }`}
            onClick={() => handleChange(i + 1)}
          >
            <Text type="tiny" as="p" fontWeight="light">
              {i + 1}
            </Text>
          </button>
        ))}
      </div>
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text type="tiny" as="p" fontWeight="light">
          {currentPage === totalPages ? 'Last' : 'Next'}
        </Text>
      </button>
    </div>
  );
};

export default Pagination;
