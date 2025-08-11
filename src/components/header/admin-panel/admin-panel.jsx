'use client';

import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getActiveSection } from '@/redux/technical/technical-selectors';
import { updateIsLoginPanel } from '@/redux/auth/auth-slice';
import clsx from 'clsx';
import Text from '@/components/shared/text/text';
import { BsEscape } from 'react-icons/bs';

export const sections = [
  {
    id: 'admin-collection',
    label: 'Admin Collection',
    offset: -130,
    offsetLogin: -190,
    offsetLoginMobile: -25,
  },
  {
    id: 'admin-models',
    label: 'Admin Models',
    offset: -85,
    offsetLogin: -148,
    offsetLoginMobile: -85,
  },
  {
    id: 'admin-fabrics',
    label: 'Admin Fabrics',
    offset: -85,
    offsetLogin: -190,
    offsetLoginMobile: -85,
  },
  {
    id: 'admin-stories',
    label: 'Admin Stories',
    offset: -135,
    offsetLogin: -148,
    offsetLoginMobile: 25,
  },
];

const AdminPanel = ({ textColor = 'black' }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPanel = useSelector(getIsLoginPanel);
  const activeSection = useSelector(getActiveSection);

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

  const handleExit = () => {
    localStorage.removeItem('pink-skirt');
    dispatch(updateIsLoginPanel(false));
    router.push('/');
  };

  return (
    <nav className="relative container w-full py-[13px]">
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
                  type="small"
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

      <div className="absolute top-0 right-4 h-full flex flex-row items-center">
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
    </nav>
  );
};

export default AdminPanel;
