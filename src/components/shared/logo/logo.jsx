import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ width = 130, height = 35 }) => {
  return (
    <Link href="/" className="cursor-pointer">
      <div
        className="relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src="/images/logo_pink.png"
          alt="Logo"
          fill
          className="object-contain"
          priority
          sizes={`${width}px`}
        />
      </div>
    </Link>
  );
};

export default Logo;
