import Link from 'next/link';
import Image from 'next/image';

const Logo = ({ width = 125, height = 30 }) => {
  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src="/images/logo_pink.png"
        alt="Logo"
        width={width}
        height={height}
      />
    </Link>
  );
};

export default Logo;
