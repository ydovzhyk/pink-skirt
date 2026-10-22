'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { RiArrowGoBackFill } from 'react-icons/ri';
import Text from '../../shared/text/text';
import { useTranslate } from '@/utils/translating/translating';
import {
  renderFormattedStory,
  restoreParagraphBreaks,
} from '../format-story-content';
import ActivePhotoMark from '../../shared/active-photo-mark';
import { slugify } from '@/utils/seo/public-url';
import Photo from '@/components/shared/photo';

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
  const translatedContent = useTranslate(restoreParagraphBreaks(content || ''));
  const currentIndex = allStories.findIndex(story => story.id === id);
  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex >= 0 && currentIndex < allStories.length - 1;

  const previousStory = hasPrevious ? allStories[currentIndex - 1] : null;
  const nextStory = hasNext ? allStories[currentIndex + 1] : null;
  const storyHref = item =>
    `/story/${slugify(item.title) || item.id}/${item.id}`;
  const imagesAll = [mainImageUrl, ...(additionalImageUrls || [])].filter(
    Boolean,
  );
  const activeIndex = Math.max(0, imagesAll.indexOf(activeImage));

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
            <div className="relative w-full aspect-[27/40] overflow-hidden rounded-md">
              <Photo src={activeImage} title={title} index={activeIndex} />
            </div>
          )}

          {additionalImageUrls.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex gap-[2%] justify-start overflow-x-auto scroll-smooth thin-scrollbar pb-2">
                {imagesAll.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className="relative min-w-[32%] aspect-[27/40] flex-shrink-0 cursor-pointer overflow-hidden rounded-md border border-transparent"
                  >
                    <Photo src={img} title={title} index={i} />
                    {activeImage === img && <ActivePhotoMark />}
                  </div>
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
            {renderFormattedStory(translatedContent)}
          </Text>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {previousStory ? (
          <Link
            href={storyHref(previousStory)}
            aria-label={`Previous post: ${previousStory.title}`}
            title={`Previous post: ${previousStory.title}`}
            className="text-black border-b border-gray-400 hover:border-[var(--accent)] w-fit text-left transition-colors duration-200"
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Previous post
            </Text>
          </Link>
        ) : (
          <span className="text-black border-b border-gray-300 max-w-[46%] opacity-50">
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Previous post
            </Text>
          </span>
        )}
        {nextStory ? (
          <Link
            href={storyHref(nextStory)}
            aria-label={`Next post: ${nextStory.title}`}
            title={`Next post: ${nextStory.title}`}
            className="text-black border-b border-gray-400 hover:border-[var(--accent)] w-fit text-right transition-colors duration-200"
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Next post
            </Text>
          </Link>
        ) : (
          <span className="text-black border-b border-gray-300 max-w-[46%] text-right opacity-50">
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-black"
            >
              Next post
            </Text>
          </span>
        )}
      </div>
    </section>
  );
};

export default StoryDetail;
