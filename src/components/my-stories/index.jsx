'use client';
// @flow strict
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStories } from '@/redux/stories/stories-operations';
import {
  getStoriesList,
  getTotalPages,
  getCurrentPage,
} from '@/redux/stories/stories-selectors';
import Text from '../shared/text/text';
import StoryCard from './story-card/index';
import Pagination from '../shared/pagination/index';

function MyStories() {
  const dispatch = useDispatch();
  const stories = useSelector(getStoriesList);
  const totalPages = useSelector(getTotalPages);
  const currentPage = useSelector(getCurrentPage);

  useEffect(() => {
    dispatch(getStories({ page: currentPage, limit: 2 }));

    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, currentPage]);

  if (stories.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--section-third)] border border-transparent">
      <section
        id="contacts"
        className={`container mt-12 lg:mt-16 ${
          totalPages > 1 ? 'mb-[64px]' : 'lg:mb-[104px]'
        }`}
      >
        <div className="flex items-center justify-start relative my-12 lg:my-16">
          <div className="bg-[var(--section-first)] absolute left-0 w-fit px-5 py-3 rounded-md border border-[#dcdcc4]">
            <Text
              type="regular"
              as="span"
              fontWeight="normal"
              className="text-[#e83894] uppercase rotate-90 p-2 px-5 bg-[var(--section-first)]"
            >
              My Stories
            </Text>
          </div>
          <span
            className="w-full bg-[#1a1443]"
            style={{ height: '0.5px' }}
          ></span>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {stories.map(story => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>

        {totalPages > 0 && (
          <div className="mt-[70px] flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </section>
    </div>
  );
}

export default MyStories;
