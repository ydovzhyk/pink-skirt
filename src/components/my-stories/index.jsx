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
    <div className="bg-[var(--section-third)] border border-transparent">
      <section
        ref={storiesRef}
        id="stories"
        className={`container mt-12 lg:mt-16 ${
          totalPages > 1 ? 'mb-[64px]' : 'lg:mb-[104px]'
        }`}
      >
        <div className="flex items-center justify-start relative my-12 lg:my-16">
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
          <span
            className="w-full border-t border-gray-400"
          ></span>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {stories.map(story => (
            <StoryCard key={story.id} {...story} story={story} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-[70px] flex justify-center">
            <Pagination totalPages={totalPages} type="stories" />
          </div>
        )}
      </section>
    </div>
  );
}

export default MyStories;
