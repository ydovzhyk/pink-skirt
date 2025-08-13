import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getSections } from '@/components/header/navigation/navigation';

const ScrollToHashSection = () => {
  const isLoginPanel = useSelector(getIsLoginPanel);
  const sections = getSections(true, true);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setAfterMobileHeader(window.innerWidth > 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    const section = sections.find(sec => sec.id === id);
    const yOffset = (isLoginPanel && afterMobileHeader) ? section?.offsetLogin : section?.offset;

    const element = document.getElementById(id);
    if (element && yOffset !== undefined) {
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
