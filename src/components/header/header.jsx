'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navigation from './navigation/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import Logo from '../shared/logo/logo';
import TranslateMe from '@/utils/translating/translating';
import AdminPanel from './admin-panel/admin-panel';
import clsx from 'clsx';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const isLoginPanel = useSelector(getIsLoginPanel);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-200 shadow-sm',
        scrolled
          ? 'backdrop-blur-md bg-[var(--sectionfirst)] bg-opacity-50'
          : 'bg-[var(--sectionfirst)]'
      )}
    >
      <div className="container mx-auto py-3 flex items-center justify-between relative">
        <div>
          <Navigation />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo width={200} height={52} />
        </div>

        <div>
          <TranslateMe />
        </div>
      </div>
      {isLoginPanel && (
        <AdminPanel />
      )}
    </header>
  );
};

export default Header;
