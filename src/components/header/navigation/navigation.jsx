'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Text from '@/components/shared/text/text';

const sections = [
  { id: 'models', label: 'Models' },
  { id: 'cloths', label: 'Cloths' },
  { id: 'finished-goods', label: 'Finished goods' },
  { id: 'about', label: 'About us' },
  { id: 'contacts', label: 'Contacts' },
];

const Navigation = ({ textColor = 'black', activeSection }) => {
  const pathname = usePathname();

  const handleNavigate = id => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -100;
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
    <nav className="relative w-full py-[13px]">
      <ul className="flex flex-row items-center justify-center gap-[20px] w-full">
        {sections.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <li key={id}>
              <button
                onClick={() => handleNavigate(id)}
                className="relative block py-2 no-underline outline-none hover:no-underline group"
              >
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="light"
                  className={`text-${textColor}`}
                >
                  {label}
                </Text>
                <span
                  className={clsx(
                    'absolute bottom-[5px] left-0 w-full h-[0.5px] rounded-full transition-all duration-300',
                    isActive
                      ? 'bg-[#e83894] opacity-100'
                      : 'bg-black opacity-0 group-hover:opacity-100'
                  )}
                ></span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
