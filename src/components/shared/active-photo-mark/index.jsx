import { HiCheck } from 'react-icons/hi';

const ActivePhotoMark = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute bottom-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--section-first)] shadow-sm"
  >
    <HiCheck className="h-4 w-4 text-[var(--accent)]" />
  </span>
);

export default ActivePhotoMark;
