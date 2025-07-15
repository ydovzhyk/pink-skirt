'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navigation from './navigation/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import Logo from '../shared/logo/logo';
import TranslateMe from '@/utils/translating/translating';
import AdminPanel from './admin-panel/admin-panel';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [headerState, setHeaderState] = useState('default');
  const isLoginPanel = useSelector(getIsLoginPanel);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const onScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 520) {
        setHeaderState('colored');
      } else if (scrollY > 10) {
        setHeaderState('transparent');
      } else {
        setHeaderState('default');
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b shadow-sm',
        headerState === 'default' && 'bg-[var(--sectionfirst)] border-gray-200',
        headerState === 'transparent' && 'bg-transparent border-transparent',
        headerState === 'colored' &&
          'bg-[var(--sectionfirst)] border-gray-300 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto py-3 flex items-center justify-between relative">
        <div>
          <Navigation
            textColor={headerState === 'transparent' ? 'white' : 'black'}
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

      {isLoginPanel && <AdminPanel />}
    </header>
  );
};

export default Header;

