'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Navigation from './navigation/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import Logo from '../shared/logo/logo';
import TranslateMe from '@/utils/translating/translating';
import AdminPanel from './admin-panel/admin-panel';
import ActiveSectionObserver from '@/utils/active-section-observer';

const Header = () => {
  const [headerState, setHeaderState] = useState('colored');
  const [activeSection, setActiveSection] = useState('');
  const isLoginPanel = useSelector(getIsLoginPanel);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const onScroll = () => {
      if (activeSection === 'bottom-banner') {
        setHeaderState('transparent');
      } else {
        const scrollY = window.scrollY;
        if (scrollY > 580) {
          setHeaderState('colored');
        } else if (scrollY > 85) {
          setHeaderState('transparent');
        } else {
          setHeaderState('colored');
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, activeSection]);


  return (
    <header
      id="header"
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b shadow-sm',
        headerState === 'transparent' && 'bg-transparent border-transparent',
        headerState === 'colored' &&
          'bg-[var(--sectionfirst)] border-gray-300 backdrop-blur-md'
      )}
    >
      <ActiveSectionObserver setActiveSection={setActiveSection} />
      <div className="container mx-auto py-3 flex items-center justify-between relative">
        <div>
          <Navigation
            textColor={headerState === 'transparent' ? 'white' : 'black'}
            activeSection={activeSection}
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo width={220} height={60} />
        </div>

        <div>
          <TranslateMe
            textColor={headerState === 'transparent' ? 'white' : 'black'}
          />
        </div>
      </div>

      {isLoginPanel && (
        <AdminPanel
          textColor={headerState === 'transparent' ? 'white' : 'black'}
        />
      )}
    </header>
  );
};
export default Header;

  // useEffect(() => {
  //   if (pathname !== '/') return;
  //   const onScroll = () => {
  //     const scrollY = window.scrollY;
  //     if (scrollY > 580) {
  //       setHeaderState('colored');
  //     } else if (scrollY > 85) {
  //       setHeaderState('transparent');
  //     } else {
  //       setHeaderState('colored');
  //     }
  //   };

  //   window.addEventListener('scroll', onScroll);
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, [pathname]);
