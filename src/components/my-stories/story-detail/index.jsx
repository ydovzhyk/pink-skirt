'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { RiArrowGoBackFill } from 'react-icons/ri';
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
  const screenType = useSelector(getScreenType);
  const router = useRouter();

  const currentIndex = allStories.findIndex(story => story.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allStories.length - 1;

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
    const previousStory = allStories[currentIndex - 1];
    if (previousStory) {
      handleNavigate(previousStory.title, previousStory.id);
    }
  };

  const handleNextPost = () => {
    const nextStory = allStories[currentIndex + 1];
    if (nextStory) {
      handleNavigate(nextStory.title, nextStory.id);
    }
  };

  return (
    <section
      id="story-detail"
      className="relative container py-12 lg:py-16 flex flex-col gap-10 lg:gap-12"
    >
      <button
        onClick={() => router.back()}
        className="absolute top-5 left-0 flex items-center gap-2 px-3 py-2 text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
      >
        <RiArrowGoBackFill className="w-5 h-5" />
        <Text
          type="small"
          as="p"
          fontWeight="light"
          className="text-[var(--text-title)]"
        >
          Go back
        </Text>
      </button>

      <div className="flex flex-col justify-center items-center mt-5">
        <div className="text-center">
          <Text
            type="normal"
            as="h2"
            fontWeight="medium"
            className="text-black mb-5"
          >
            {title}
          </Text>
          <Text type="small" as="p" fontWeight="light" className="text-black">
            {new Date(date).toDateString()}
          </Text>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="w-full">
          {activeImage && (
            <div
              className="relative w-full aspect-[27/40] bg-cover bg-center rounded-md"
              style={{ backgroundImage: `url(${activeImage})` }}
            >
            </div>
          )}

          {additionalImageUrls.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex gap-[2%] justify-start overflow-x-auto scroll-smooth thin-scrollbar pb-2">
                {[mainImageUrl, ...additionalImageUrls].map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`min-w-[32%] aspect-[27/40] flex-shrink-0 bg-cover bg-center cursor-pointer rounded-md ${
                      activeImage === img
                        ? 'border-[var(--accent)] border-2'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center items-start">
          <Text
            type={
              screenType === 'isDesktop'
                ? 'tiny'
                : screenType === 'isTablet'
                  ? 'small'
                  : screenType === 'isMobile'
                    ? 'tiny'
                    : 'tiny'
            }
            as="p"
            fontWeight="light"
            lineHeight="snug"
            className="text-[var(--text-title)] whitespace-pre-line"
          >
            {content}
          </Text>
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
