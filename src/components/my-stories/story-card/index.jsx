'use client';
// @flow strict
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setEditStory } from '@/redux/stories/stories-slice';
import { deleteStory, getStories } from '@/redux/stories/stories-operations';
import Text from '../../shared/text/text';
import { getCurrentPageStories } from '@/redux/stories/stories-selectors';

const StoryCard = ({ id, title, date, content, mainImageUrl, story }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPageStories);

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

  const handleDelete = () => {
    dispatch(deleteStory(id));
    dispatch(getStories({ page: currentPage, limit: 2 }));
  };

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center">
      <div
        className="relative w-full sm:w-1/2 aspect-[3/4] rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${mainImageUrl})` }}
      ></div>

      <div className="relative z-10 flex flex-col justify-between bg-white sm:absolute sm:right-[60px] sm:bottom-[-40px] w-full sm:w-1/2 aspect-[3/4] px-6 py-4 sm:px-6 sm:py-5 rounded-md shadow-lg">
        <div className="flex flex-col gap-3">
          <Text
            type="normal"
            as="h3"
            fontWeight="medium"
            className="text-black"
          >
            {title}
          </Text>
          <Text type="tiny" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
          <Text
            type="tiny"
            as="p"
            fontWeight="light"
            lineHeight="snug"
            className="text-black whitespace-pre-line"
          >
            {String(content.slice(0, 240)) + '...'}
          </Text>
        </div>
        <button
          className="border-b border-gray-400 hover:border-[var(--accent)] w-fit transition-colors duration-200"
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
