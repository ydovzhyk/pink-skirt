'use client';

import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getActiveSection } from '@/redux/technical/technical-selectors';
import clsx from 'clsx';
import Text from '@/components/shared/text/text';
import { getSections } from '../navigation/navigation';

const AdminPanel = ({ textColor = 'black' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPanel = useSelector(getIsLoginPanel);
  const activeSection = useSelector(getActiveSection);

  const editableSectionIds = ['models', 'cloths', 'ready-goods', 'stories'];
  const sections = getSections(true, true, editableSectionIds);

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = isLoginPanel ? section?.offsetLogin : section?.offset;

    router.push(`/admin/#${id}`);

    setTimeout(() => {
      const element = document.getElementById(id);

      if (element && yOffset !== undefined) {
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  return (
    <nav className="relative w-full py-[13px]">
      <ul className="flex flex-row items-center justify-center gap-[20px] w-full">
        {sections.map(({ id, label }) => {
          const isActive = pathname === '/admin' && activeSection === id;
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
                      : 'bg-[#e83894] opacity-0 group-hover:opacity-100'
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

export default AdminPanel;
