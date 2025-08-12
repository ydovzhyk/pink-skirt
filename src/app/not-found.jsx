'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import Text from '@/components/shared/text/text';
import { getStories } from '../redux/stories/stories-operations';
import { getReadyGoods } from '../redux/ready-goods/ready-goods-operations';
import { getModels } from '../redux/models/models-operations';

export default function NotFound() {
  const dispatch = useDispatch();
  const isLoginPanel = useSelector(getIsLoginPanel);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getStories({ page: 1, limit: 2 }));
    dispatch(getReadyGoods({ page: 1, limit: 2 }));
    dispatch(getModels());
  }, [dispatch]);

  useEffect(() => {
    const onResize = () => setAfterMobileHeader(window.innerWidth > 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const topOffset = useMemo(
    () => (isLoginPanel && afterMobileHeader ? 148 : 85),
    [isLoginPanel, afterMobileHeader]
  );

  return (
    <section
      className="relative bg-center bg-no-repeat bg-cover"
      style={{
        paddingTop: `${topOffset}px`,
        height: `calc(100dvh - ${topOffset}px)`,
        backgroundImage: 'url(/images/404-bg.webp)',
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <div className="w-full h-ful flex flex-row items-center justify-center">
        <div className="container relative flex flex-col gap-12 items-center">
          <div className="flex flex-col items-center gap-5">
            <Text
              type="xxl"
              as="p"
              fontWeight="semibold"
              className="text-[#FAFCFF]"
              textShadow="black"
              noTranslate={true}
            >
              404
            </Text>
            <Text
              type="xxl"
              as="h1"
              fontWeight="semibold"
              className="text-[#FAFCFF]"
              textShadow="black"
            >
              Page Not Found
            </Text>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center">
            <div className="w-[100%] sm:w-[40%]"></div>
            <div className="w-[80%] sm:w-[60%] flex flex-col items-center justify-center gap-3">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[#FAFCFF]"
                textShadow="black"
              >
                Hi, this page is on vacation.
              </Text>
              <Text
                type="banner"
                as="p"
                fontWeight="light"
                className="text-[#FAFCFF]"
                textShadow="black"
              >
                You should be too.
              </Text>

              <div className="text-center">
                <Text
                  type="tiny"
                  as="span"
                  fontWeight="light"
                  className="text-[#FAFCFF]"
                  textShadow="black"
                >
                  But don&apos;t worry, you can find your way back to my{' '}
                </Text>
                <Link
                  href="/"
                  className="underline decoration-[#e83894] underline-offset-4 hover:opacity-80 lowercase"
                  aria-label="Go to homepage"
                >
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[#FAFCFF]"
                    textShadow="black"
                  >
                    site.
                  </Text>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
