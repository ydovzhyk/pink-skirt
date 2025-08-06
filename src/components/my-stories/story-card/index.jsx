'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setEditStory } from '@/redux/stories/stories-slice';
import { deleteStory, getStories } from '@/redux/stories/stories-operations';
import Text from '../../shared/text/text';
import { getCurrentPageStories } from '@/redux/stories/stories-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';

const StoryCard = ({ id, title, date, content, mainImageUrl, story }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPageStories);
  const screenType = useSelector(getScreenType);

  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const formattedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const handleNavigate = () => {
    router.push(`/story/${formattedTitle}/${id}`);
  };

  const handleEdit = () => {
    dispatch(setEditStory(story));
    setTimeout(() => {
      const editSection = document.getElementById('edit-story');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handleDelete = async () => {
    await dispatch(deleteStory(id)).unwrap();
    await dispatch(getStories({ page: currentPage, limit: 2 })).unwrap();
  };

  return (
    <div className="relative flex flex-col lg:flex-row lg:items-center">
      <div
        className="relative w-full lg:w-[60%] aspect-[3/4] rounded-t-md lg:rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${mainImageUrl})` }}
      ></div>

      <div className="w-full lg:w-[55%] min-h-[185px] md:min-h-[280px] lg:min-h-[385px] px-6 py-4 sm:px-6 sm:py-5 rounded-b-md lg:rounded-md shadow-lg bg-white flex flex-col justify-between lg:absolute lg:top-[40px] lg:left-[45%] lg:h-full lg:aspect-[3/4]">
        <div className="w-full h-full flex flex-col gap-3">
          <Text
            type="normal"
            as="h3"
            fontWeight="medium"
            className="text-black"
          >
            {title}
          </Text>
          <Text type="small" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
          <Text
            type={
              screenType === 'isDesktop'
                ? 'tiny'
                : screenType === 'isTablet'
                  ? 'small'
                  : screenType === 'isMobile'
                    ? 'tiny'
                    : 'normal'
            }
            as="p"
            fontWeight="light"
            lineHeight="normal"
            className="text-[var(--text-title)] whitespace-pre-line"
          >
            {String(content.slice(0, 165)) + '...'}
          </Text>
        </div>

        <button
          className="border-b border-gray-400 hover:border-[var(--accent)] w-fit transition-colors duration-200 mt-3 md:mt-0"
          onClick={handleNavigate}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Read more
          </Text>
        </button>

        {isAdmin && (
          <div className="absolute top-[-55px] left-0 w-full flex flex-row gap-[80px] items-center justify-center mt-4 rounded-md bg-white shadow-lg p-2">
            <button
              className="border-b border-green-600 hover:border-black w-fit transition-colors duration-200"
              onClick={handleEdit}
            >
              <Text
                type="extra-small"
                as="p"
                fontWeight="light"
                className="text-green-900"
              >
                Edit
              </Text>
            </button>
            <button
              className="border-b border-red-600 hover:border-black w-fit transition-colors duration-200"
              onClick={handleDelete}
            >
              <Text
                type="extra-small"
                as="p"
                fontWeight="light"
                className="text-red-600"
              >
                Delete
              </Text>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
