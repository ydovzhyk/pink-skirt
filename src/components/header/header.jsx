'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Logo from '../shared/logo/logo';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import TranslateMe from '@/utils/translating/translating';
import AdminPanel from './admin-panel/admin-panel';
import Navigation from './navigation/navigation';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { updateIsLoginPanel } from '../../redux/auth/auth-slice';
import Image from 'next/image';
import MobileNavigation from './mobile-navigation/index';
import AdminMobileNavigation from './admin-mobile-navigation';
import Text from '../shared/text/text';
import Link from 'next/link';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { GoMail } from 'react-icons/go';
import { HiOutlinePhone } from 'react-icons/hi';
import { IoLogoInstagram } from 'react-icons/io5';
import { BsEscape } from 'react-icons/bs';

const Header = () => {
  const dispatch = useDispatch();
  const [headerState, setHeaderState] = useState('colored');
  const isLoginPanel = useSelector(getIsLoginPanel);
  const pathname = usePathname();
  const router = useRouter();
  const screenType = useSelector(getScreenType);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileHeader, setIsMobileHeader] = useState(false);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

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

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileHeader(window.innerWidth <= 768);
      setAfterMobileHeader(window.innerWidth > 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleExit = () => {
      localStorage.removeItem('pink-skirt');
      dispatch(updateIsLoginPanel(false));
      router.push('/');
    };

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
      <div className="relative container h-[85px] mx-auto flex items-center justify-between">
        {isMobileHeader && (
          <div className="w-[60px] flex flex-row items-center justify-center">
            <Image
              src={
                headerState === 'transparent'
                  ? '/images/menu-white.png'
                  : '/images/menu.png'
              }
              alt="Menu"
              width={35}
              height={45}
              className="cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ height: '25px', width: 'auto' }}
            />
          </div>
        )}

        {screenType === 'isDesktop' && (
          <div>
            <Navigation
              textColor={headerState === 'transparent' ? 'white' : '#444444'}
            />
          </div>
        )}

        {screenType === 'islaptop' && (
          <div>
            <Navigation
              textColor={headerState === 'transparent' ? 'white' : '#444444'}
            />
          </div>
        )}

        {screenType === 'isDesktop' && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-[-20px]">
            <Logo width={224} height={61} />
          </div>
        )}

        {(screenType === 'isLaptop' ||
          (screenType === 'isTablet' && afterMobileHeader)) && (
          <div className="mt-[-20px]">
            {screenType === 'isLaptop' && <Logo width={224} height={61} />}
            {screenType === 'isTablet' && <Logo width={162} height={44} />}
          </div>
        )}

        {isMobileHeader && (
          <div className="mt-[-10px]">
            <Logo width={178} height={48} />
          </div>
        )}

        {(screenType === 'isLaptop' ||
          (screenType === 'isTablet' && afterMobileHeader)) && (
          <div>
            <Navigation
              textColor={headerState === 'transparent' ? 'white' : '#444444'}
            />
          </div>
        )}

        <div>
          <TranslateMe
            textColor={headerState === 'transparent' ? 'white' : '#444444'}
          />
        </div>
      </div>

      {isLoginPanel && !isMobileHeader && (
        <AdminPanel
          textColor={headerState === 'transparent' ? 'white' : '#444444'}
        />
      )}

      {isMobileMenuOpen && isMobileHeader && (
        <div className="fixed top-[85px] left-0 w-full h-[calc(100vh-85px)] bg-[var(--section-first)] z-[60] border-t border-gray-300 shadow-lg flex flex-row items-start justify-center">
          <div className="container flex flex-col justify-start items-start gap-6 transition-all duration-300">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end text-2xl text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
              aria-label="Close menu"
            >
              ✕
            </button>

            <div className="flex flex-row items-start justify-between gap-10">
              <MobileNavigation onClose={() => setIsMobileMenuOpen(false)} />
              {isLoginPanel && (
                <AdminMobileNavigation
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              )}
            </div>

            {isLoginPanel && (
              <>
                <div className="border-t border-gray-300 w-full" />
                <div className="w-full flex flex-row items-center justify-center">
                  <button
                    onClick={handleExit}
                    className="flex items-center gap-3 py-2 text-[var(--text-title)] hover:text-black"
                  >
                    <Text
                      type="small"
                      as="p"
                      fontWeight="light"
                      className="text-[var(--text-title)] hover:text-dark"
                    >
                      Exit
                    </Text>
                    <BsEscape className="w-[30px] h-[30px]" />
                  </button>
                </div>
              </>
            )}

            <div className="border-t border-gray-300 w-full" />
            <ul className="w-full grid grid-cols-2 gap-x-6 gap-y-4">
              <li>
                <a
                  href="https://t.me/pinkskirt_uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors text-gray-500 duration-300 hover:text-black"
                >
                  <FaTelegramPlane className="w-[20px] h-[20px]" />
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-inherit"
                    noTranslate="true"
                  >
                    Telegram
                  </Text>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/447748068828"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors text-gray-500 duration-300 hover:text-black"
                >
                  <FaWhatsapp className="w-[20px] h-[20px]" />
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-inherit"
                    noTranslate="true"
                  >
                    WhatsApp
                  </Text>
                </a>
              </li>
              <li>
                <a
                  href="mailto:pinkskirt.atelier@gmail.com"
                  className="flex items-center gap-2 transition-colors text-gray-500 duration-300 hover:text-black"
                >
                  <GoMail className="w-[18px] h-[18px]" />
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-inherit"
                    noTranslate="true"
                  >
                    email
                  </Text>
                </a>
              </li>
              <li>
                <a
                  href="tel:+447748068828"
                  className="flex items-center gap-2 transition-colors text-gray-500 duration-300 hover:text-black"
                >
                  <HiOutlinePhone className="w-[20px] h-[20px]" />
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-inherit"
                    noTranslate="true"
                  >
                    phone
                  </Text>
                </a>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/pinkskirt.uk?igsh=MWhkcXp2YXIxMWpmMA%3D%3D&utm_source=qr"
                  target="_blank"
                  className="flex items-center gap-2 transition-colors text-gray-500 duration-300 hover:text-black"
                >
                  <IoLogoInstagram className="w-[20px] h-[20px]" />
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-inherit"
                    noTranslate="true"
                  >
                    Instagram
                  </Text>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
