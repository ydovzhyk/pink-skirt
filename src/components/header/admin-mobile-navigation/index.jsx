'use client';

import { useRouter } from 'next/navigation';
import Text from '@/components/shared/text/text';
import { sections } from '@/components/header/admin-panel/admin-panel';

const AdminMobileNavigation = ({ onClose }) => {
  const router = useRouter();

  const handleNavigate = id => {
    const section = sections.find(sec => sec.id === id);
    const yOffset = section?.offset;

    if (onClose) onClose();

    router.push(`/admin/#${id}`, { scroll: false });

    let tries = 0;
    const maxTries = 60;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset +
          (yOffset ?? 0);
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (tries++ < maxTries) {
        requestAnimationFrame(tryScroll);
      }
    };

    requestAnimationFrame(tryScroll);
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
