'use client';

import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getModelsList } from '@/redux/models/models-selectors';
import { getActiveSection } from '@/redux/technical/technical-selectors';
import clsx from 'clsx';
import Text from '@/components/shared/text/text';

export const getSections = (
  hasReadyGoods = true,
  hasStories = true,
  hasModels = true,
  allowedIds = null
) => {
  let sections = [
    ...(hasReadyGoods
      ? [
          {
            id: 'collection',
            label: 'Collection',
            offset: -84,
            offsetLogin: -144,
          },
        ]
      : []),
    ...(hasModels
      ? [{ id: 'models', label: 'Models', offset: -85, offsetLogin: -145 }]
      : []),
    { id: 'fabrics', label: 'Fabrics', offset: -85, offsetLogin: -190 },
    { id: 'about-me', label: 'About me', offset: -85, offsetLogin: -145 },
    { id: 'contacts', label: 'Contacts', offset: -130, offsetLogin: -190 },
    ...(hasStories
      ? [
          {
            id: 'stories',
            label: 'Stories',
            offset: -150,
            offsetLogin: -210,
          },
        ]
      : []),
  ];

  if (allowedIds) {
    sections = sections.filter(section => allowedIds.includes(section.id));
  }

  return sections;
};


const Navigation = ({ textColor = '#444444' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPanel = useSelector(getIsLoginPanel);
  const activeSection = useSelector(getActiveSection);
  const stories = useSelector(getAllStories);
  const readyGoods = useSelector(getAllReadyGoods);
  const modelItems = useSelector(getModelsList);

  const hasStories = stories.length > 0;
  const hasReadyGoods = readyGoods.length > 0;
  const hasModels = modelItems.length > 0;

  const sections = getSections(hasReadyGoods, hasStories, hasModels);

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = isLoginPanel ? section?.offsetLogin : section?.offset;

    router.push(`/#${id}`);

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
  };

  return (
    <nav className="relative w-full py-[13px]">
      <ul className="flex flex-row items-center justify-center gap-[20px] w-full">
        {sections.map(({ id, label }) => {
          const isActive = pathname === '/' && activeSection === id;
          return (
            <li key={id}>
              <button
                onClick={() => handleNavigate(id)}
                className="relative block py-2 no-underline outline-none hover:no-underline group"
              >
                <Text
                  type="small"
                  as="p"
                  fontWeight="light"
                  color={textColor}
                >
                  {label}
                </Text>
                <span
                  className={clsx(
                    'absolute bottom-[5px] left-0 w-full h-[0.5px] rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-[#e83894] opacity-100'
                      : 'bg-[#e83894] opacity-0 group-hover:opacity-100'
                  )}
                ></span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
