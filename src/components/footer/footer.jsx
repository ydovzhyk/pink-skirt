'use client';

import Link from 'next/link';
import FooterNavigation from './footer-navigation/footer-navigation';
import Text from '@/components/shared/text/text';
import Logo from '../shared/logo/logo';
import {
  FaTelegramPlane,
  FaWhatsapp,
} from 'react-icons/fa';
import { GoMail } from 'react-icons/go';
import { HiOutlinePhone } from 'react-icons/hi';
import { IoLogoInstagram } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-[var(--sectionfirst)] flex flex-col gap-4 py-12 border-t border-gray-200 shadow-sm">
      <div className="container w-[80%] flex flex-row justify-between">
        <div>
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
        <div>
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
        <div>
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
      <div className="container w-full flex flex-col items-center justify-center">
        <Logo width={561} height={153} />
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
