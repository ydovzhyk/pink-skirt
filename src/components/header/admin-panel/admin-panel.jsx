'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Text from '@/components/shared/text/text';

const sections = [
  { id: 'models', label: 'Models' },
  { id: 'cloths', label: 'Cloths' },
  { id: 'finished-goods', label: 'Finished goods' },
  { id: 'about', label: 'About us' },
  { id: 'contacts', label: 'Contacts' },
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = id => {
    if (pathname !== '/admin') {
      // якщо ми НЕ на /admin, переходимо на нього із hash
      router.push(`/admin#${id}`);
    } else {
      // якщо ми вже на /admin, прокручуємо одразу
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });

        setActiveSection(id);
      }
    }
  };

  return (
    <nav className="admin-panel relative w-full py-[13px] border-t border-gray-200 shadow-sm">
      <ul className="flex flex-row items-center justify-center gap-[20px] w-full">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => handleNavigate(id)}
              className="relative block py-2 no-underline outline-none hover:no-underline group"
            >
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className={`transition-colors duration-300 ${
                  activeSection === id ? 'text-pink-600' : 'text-black'
                }`}
              >
                {label}
              </Text>

              <span
                className={`
                  absolute bottom-[5px] left-0 w-full h-[0.5px] bg-black rounded-full
                  transition-all duration-300
                  ${activeSection === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
              ></span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminPanel;
