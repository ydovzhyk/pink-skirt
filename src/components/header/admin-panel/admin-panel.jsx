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
    offset: -105,
    offsetLogin: -190,
  },
  {
    id: 'admin-models',
    label: 'Admin Models',
    offset: -63,
    offsetLogin: -148,
  },
  {
    id: 'admin-fabrics',
    label: 'Admin Fabrics',
    offset: -85,
    offsetLogin: -148,
  },
  {
    id: 'admin-stories',
    label: 'Admin Stories',
    offset: -85,
    offsetLogin: -148,
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

    router.push(`/admin/#${id}`, { scroll: false });

    let tries = 0;
    const maxTries = 60;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.pageYOffset + (yOffset ?? 0);
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (tries++ < maxTries) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);
  };

  const handleExit = () => {
    localStorage.removeItem('pink-skirt');
    router.replace('/');
    setTimeout(() => {
      dispatch(updateIsLoginPanel(false));
    }, 50);
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
          className="relative flex flex-row gap-3 items-center py-2 no-underline outline-none hover:no-underline group"
        >
          <Text
            type="small"
            as="p"
            fontWeight="light"
            className={`text-${textColor}`}
          >
            Exit
          </Text>
          <BsEscape
            className={`text-${textColor === 'black' ? 'var(--text-title)' : textColor} w-[30px] h-[30px] mb-[4px]`}
          />
          <span
            className={clsx(
              'absolute bottom-[3px] left-0 w-full h-[0.5px] rounded-full transition-all duration-300 bg-[#e83894] opacity-0 group-hover:opacity-100'
            )}
          ></span>
        </button>
      </div>
    </nav>
  );
};

export default AdminPanel;
