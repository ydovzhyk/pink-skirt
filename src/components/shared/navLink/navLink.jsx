'use client';

import Link from 'next/link';
import Text from '../text/text';
import clsx from 'clsx';

const NavLink = ({
  href,
  isActive = false,
  children,
  textColor = 'text-[var(--text-color)]',
  underlineColor = 'bg-[var(--accent-background)]',
}) => {
  return (
    <Link
      href={href}
      className={clsx('relative inline-block text-base group cursor-pointer')}
    >
      <Text
        type="regular"
        as="span"
        fontWeight={isActive ? 'normal' : 'medium'}
        className={clsx(textColor, isActive ? 'font-bold' : 'font-medium')}
      >
        {children}
      </Text>
      <span
        className={clsx(
          'absolute left-0 block h-[1px] transition-all duration-300 ease-in-out origin-left',
          underlineColor,
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        )}
      ></span>
    </Link>
  );
};

export default NavLink;
