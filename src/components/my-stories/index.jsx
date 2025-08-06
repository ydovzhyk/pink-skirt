'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStories } from '@/redux/stories/stories-operations';
import {
  getStoriesList,
  getTotalPagesStories,
  getCurrentPageStories,
} from '@/redux/stories/stories-selectors';
import { getAllStories } from '@/redux/stories/stories-selectors';
import Text from '../shared/text/text';
import StoryCard from './story-card/index';
import Pagination from '../shared/pagination/index';

function MyStories() {
  const dispatch = useDispatch();
  const stories = useSelector(getStoriesList);
  const allStories = useSelector(getAllStories);
  const totalPages = useSelector(getTotalPagesStories);
  const currentPage = useSelector(getCurrentPageStories);
  const storiesRef = useRef(null);

  useEffect(() => {
    dispatch(getStories({ page: currentPage, limit: 2 }));
  }, [dispatch, currentPage]);

  useEffect(() => {}, [stories]);

  if (allStories.length === 0) {
    return null;
  }

  return (
    <section
      ref={storiesRef}
      id="stories"
      className="bg-[var(--section-third)] border border-transparent py-12 lg:py-16"
    >
      <div className='container flex flex-col items-center gap-10 lg:gap-12'>
      <div className=" w-full flex items-center justify-start relative">
        <div className="bg-[var(--section-first)] absolute left-0 w-fit p-2 px-5 rounded-md border border-gray-300">
          <Text
            type="regular"
            as="span"
            fontWeight="normal"
            className="text-[#e83894] uppercase rotate-90 p-1 px-5 bg-[var(--section-first)]"
          >
            My Stories
          </Text>
        </div>
        <span className="w-full border-t border-gray-400"></span>
      </div>

        <div className="w-full grid gap-10 md:grid-cols-2 mt-2 lg:mt-4">
          {stories.map(story => (
            <StoryCard key={story.id} {...story} story={story} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center lg:mt-[40px]">
            <Pagination totalPages={totalPages} type="stories" />
          </div>
        )}
      </div>
    </section>
  );
}

export default MyStories;
