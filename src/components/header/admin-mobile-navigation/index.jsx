'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Text from '@/components/shared/text/text';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { sections } from '@/components/header/admin-panel/admin-panel';

const AdminMobileNavigation = ({ onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPanel = useSelector(getIsLoginPanel);
  const [isMobileHeader, setIsMobileHeader] = useState(false);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  useEffect(() => {
      const checkWidth = () => {
        setIsMobileHeader(window.innerWidth <= 768);
        setAfterMobileHeader(window.innerWidth > 768);
      };

      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }, []);

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = section?.offset;

    if (onClose) onClose();

    setTimeout(() => {
      router.push(`/admin/#${id}`);

      if (pathname === '/admin/') {
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element && yOffset !== undefined) {
            const y =
              element.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;

            window.scrollTo({
              top: y,
              behavior: 'smooth',
            });
          }
        }, 50);
      }
    }, 300);
  };

  return (
    <ul className="flex flex-col gap-2">
      {sections.map(({ id, label }) => (
        <li key={id}>
          <button
            onClick={() => handleNavigate(id)}
            className="transition-colors duration-300 hover:text-black text-gray-600"
          >
            <Text
              type="tiny"
              as="p"
              fontWeight="light"
              className="text-inherit"
            >
              {label}
            </Text>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AdminMobileNavigation;
