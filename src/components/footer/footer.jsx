'use client';

import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
import Text from '@/components/shared/text/text';
import Link from 'next/link';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { GoMail } from 'react-icons/go';
import { HiOutlinePhone } from 'react-icons/hi';
import { IoLogoInstagram } from 'react-icons/io5';
import PartnersSlider from '../partners-slider';
import Logo from '../shared/logo/logo';
import FooterNavigation from './footer-navigation/footer-navigation';

const Footer = () => {
  const screenType = useSelector(getScreenType);

  let width;
  let height;

  if (screenType === 'isMobile') {
    width = 300;
    height = Math.round(300 * 0.2726);
  } else if (screenType === 'isTablet') {
    width = 500;
    height = Math.round(500 * 0.2726);
  } else if (screenType === 'isDesktop') {
    width = 650;
    height = Math.round(650 * 0.2726);
  }

  return (
    <footer
      id="footer"
      className="bg-[var(--section-first)] flex flex-col gap-10 lg:gap-12 py-12 lg:py-16 border-t border-gray-200 shadow-sm"
    >
      <PartnersSlider />
      <div className="container w-full lg:w-[80%] flex flex-col gap-10 lg:gap-12 md:flex-row md:justify-between">
        <div className="ml-6 md:ml-0">
          <Text
            type="regular"
            as="p"
            fontWeight="light"
            className={'text-black mb-4'}
          >
            Navigate
          </Text>
          <FooterNavigation />
        </div>
        <div className="ml-6 md:ml-0">
          <Text
            type="regular"
            as="p"
            fontWeight="light"
            className={'text-black mb-4'}
          >
            Contact me
          </Text>
          <ul className="flex flex-col gap-[15px]">
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
                  pinkskirt.atelier@gmail.com
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
                  +44 7748068828
                </Text>
              </a>
            </li>
          </ul>
        </div>
        <div className="ml-6 md:ml-0">
          <Text
            type="regular"
            as="p"
            fontWeight="light"
            className={'text-black mb-4'}
          >
            Follow me
          </Text>
          <ul className="flex flex-col gap-2">
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
      <div className="container w-full flex flex-col items-center justify-center lg:my-[-25px] my-[-10px]">
        <Logo width={width} height={height} />
      </div>
      <div className="container w-full flex flex-col items-center justify-center">
        <Text type="tiny" as="span" fontWeight="light" className="text-inherit">
          © 2025 PinkSkirt – A studio in a new format
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
