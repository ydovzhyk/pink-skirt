import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getSections } from '@/components/header/navigation/navigation';

const ScrollToHashSection = () => {
  const isLoginPanel = useSelector(getIsLoginPanel);
  const sections = getSections(true, true);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    const section = sections.find(sec => sec.id === id);
    const yOffset = isLoginPanel ? section?.offsetLogin : section?.offset;

    const element = document.getElementById(id);
    if (element && yOffset !== undefined) {
      // Дочекатися повного завантаження сторінки
      setTimeout(() => {
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [isLoginPanel, sections]);

  return null;
};

export default ScrollToHashSection;
