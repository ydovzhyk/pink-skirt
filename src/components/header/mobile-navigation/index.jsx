'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Text from '@/components/shared/text/text';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getModelsList } from '@/redux/models/models-selectors';
import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';
import { getSections } from '@/components/header/navigation/navigation';

const MobileNavigation = ({ onClose }) => {
  const router = useRouter();
  const stories = useSelector(getAllStories);
  const readyGoods = useSelector(getAllReadyGoods);
  const modelItems = useSelector(getModelsList);
  const fabrics = useSelector(getAllFabrics);

  const hasStories = stories.length > 0;
  const hasReadyGoods = readyGoods.length > 0;
  const hasModels = modelItems.length > 0;
  const hasFabrics = fabrics.length > 0;

  const sections = getSections(hasReadyGoods, hasStories, hasModels, hasFabrics);

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = section?.offset ?? 0;

    if (onClose) onClose();

    router.push(`/#${id}`, { scroll: false });

    let tries = 0;
    const maxTries = 200;

    const tryScroll = () => {
      if (window.location.pathname !== '/') {
        requestAnimationFrame(tryScroll);
        return;
      }

      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (tries++ < maxTries) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);
  };

  return (
    <ul className="flex flex-col gap-2">
      {sections.map(({ id, label }) => (
        <li key={id}>
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

export default MobileNavigation;
