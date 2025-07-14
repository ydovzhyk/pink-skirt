'use client';

import { useRouter, usePathname } from 'next/navigation';
import Text from '@/components/shared/text/text';

const sections = [
  { id: 'models', label: 'Models' },
  { id: 'cloths', label: 'Cloths' },
  { id: 'finished-goods', label: 'Finished goods' },
  { id: 'about', label: 'About us' },
  { id: 'contacts', label: 'Contacts' },
];

const FooterNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = id => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }
    }
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

export default FooterNavigation;
