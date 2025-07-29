'use client';

import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import TranslateMe from '@/utils/translating/translating';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Logo from '../shared/logo/logo';
import AdminPanel from './admin-panel/admin-panel';
import Navigation from './navigation/navigation';

const Header = () => {
  const [headerState, setHeaderState] = useState('colored');
  const isLoginPanel = useSelector(getIsLoginPanel);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      setHeaderState('colored');
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 580) {
        setHeaderState('colored');
      } else if (scrollY > 85) {
        setHeaderState('transparent');
      } else {
        setHeaderState('colored');
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <header
      id="header"
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b shadow-sm',
        headerState === 'transparent' && 'bg-transparent border-transparent',
        headerState === 'colored' &&
          'bg-[var(--section-first)] border-gray-300 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto py-3 flex items-center justify-between relative">
        <div>
          <Navigation
            textColor={headerState === 'transparent' ? 'white' : 'black'}
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo width={264} height={72} />
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
