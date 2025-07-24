'use client';
// @flow strict
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getStories } from '@/redux/stories/stories-operations';
import Text from '../../shared/text/text';

const StoryDetail = ({
  id,
  title,
  date,
  content,
  mainImageUrl,
  additionalImageUrls,
}) => {
  const [activeImage, setActiveImage] = useState(mainImageUrl);
  const allStories = useSelector(getAllStories);
  const router = useRouter();
  const dispatch = useDispatch();

  const currentIndex = allStories.findIndex(story => story.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allStories.length - 1;

  useEffect(() => {
    if (allStories.length === 0) {
      dispatch(getStories({ page: 1, limit: 2 }));
    }
    return;
  }, [dispatch, allStories.length]);

  const handleNavigate = (title, id) => {
    const formattedTitle = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    router.push(`/story/${formattedTitle}/${id}`);
  };

  const handlePreviousPost = () => {
    const currentIndex = allStories.findIndex(story => story.id === id);
    const previousStory = allStories[currentIndex - 1];
    if (previousStory) {
      handleNavigate(previousStory.title, previousStory.id);
    }
  };

  const handleNextPost = () => {
    const currentIndex = allStories.findIndex(story => story.id === id);
    const nextStory = allStories[currentIndex + 1];
    if (nextStory) {
      handleNavigate(nextStory.title, nextStory.id);
    }
  };

  return (
    <section
      id="story-detail"
      className="container my-12 lg:my-16 flex flex-col gap-12"
    >
      <div className="flex flex-col justify-center items-center">
        <div className="text-center">
          <Text
            type="normal"
            as="p"
            fontWeight="normal"
            className={'text-black mb-5'}
          >
            {title}
          </Text>
          <Text type="tiny" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
        </div>
      </div>
      <div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            {/* Основне фото */}
            {activeImage && (
              <div className="w-full max-w-[600px] aspect-[4/3] mx-auto">
                <div
                  className="w-full h-full bg-cover bg-center rounded-md"
                  style={{ backgroundImage: `url(${activeImage})` }}
                ></div>
              </div>
            )}

            {/* Слайдер додаткових фото */}
            {additionalImageUrls.length > 0 && (
              <div className="w-full mt-4 overflow-x-auto">
                <div className="mx-auto w-full">
                  <div className="flex gap-2 justify-start overflow-x-auto scroll-smooth pb-2">
                    {[mainImageUrl, ...additionalImageUrls].map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`min-w-[140px] h-[90px] flex-shrink-0 bg-cover bg-center cursor-pointer rounded-md ${
                          activeImage === img
                            ? 'border-[var(--accent)] border-2'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-start">
            <Text
              type="small"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)] whitespace-pre-line"
            >
              {content}
            </Text>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousPost}
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
            Previous post
          </Text>
        </button>
        <button
          onClick={handleNextPost}
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
            Next post
          </Text>
        </button>
      </div>
    </section>
  );
};

export default StoryDetail;
