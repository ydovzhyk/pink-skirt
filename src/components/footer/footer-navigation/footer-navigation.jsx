'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getModelsList } from '@/redux/models/models-selectors';
import { getSections } from '@/components/header/navigation/navigation';
import Text from '@/components/shared/text/text';

const FooterNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPanel = useSelector(getIsLoginPanel);
  const stories = useSelector(getAllStories);
  const readyGoods = useSelector(getAllReadyGoods);
  const modelItems = useSelector(getModelsList);

  const hasStories = stories.length > 0;
  const hasReadyGoods = readyGoods.length > 0;
  const hasModels = modelItems.length > 0;

  const sections = getSections(hasReadyGoods, hasStories, hasModels);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setAfterMobileHeader(window.innerWidth > 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = (isLoginPanel && afterMobileHeader) ? section?.offsetLogin : section?.offset;

    router.push(`/#${id}`);

    if (pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element && yOffset !== undefined) {
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });
        }
      }, 50);
    }
  };

  return (
    <ul className="flex flex-col gap-2">
      {sections.map(({ id, label }) => (
        <li
          className="w-full flex flex-col items-center md:items-start"
          key={id}
        >
          <button
            onClick={() => handleNavigate(id)}
            className="transition-colors duration-300 hover:text-black text-gray-600"
          >
            <Text
              type="tiny"
              as="p"
              fontWeight="light"
              className="text-inherit"
            >
              {label}
            </Text>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FooterNavigation;
