'use client';

import { Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import LoaderSpinner from '@/components/loader/loader';
import { getCurrentStory } from '@/redux/stories/stories-selectors';
import { getStory } from '@/redux/stories/stories-operations';
import { clearCurrentStory } from '@/redux/stories/stories-slice';
import StoryDetail from '@/components/my-stories/story-detail/index';

function DetailStoryPage() {
  const { storyName, id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const story = useSelector(getCurrentStory);

  useEffect(() => {
    if (
      !storyName ||
      typeof storyName !== 'string' ||
      !id ||
      typeof id !== 'string'
    ) {
      router.replace('/404');
      return;
    }
    dispatch(clearCurrentStory());
    dispatch(getStory({ id }));
  }, [dispatch, id, storyName, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (!story) {
    return null;
  } else {
    return (
      <div className="w-full">
        <div className="container border border-dark">
          <Suspense fallback={<LoaderSpinner />}>
            <StoryDetail {...story} />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default DetailStoryPage;
