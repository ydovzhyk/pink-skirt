'use client';

import Text from '@/components/shared/text/text';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FabricCard = ({
  id,
  fabricCategory,
  shortDescription,
  imageUrls,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mainImageUrl = imageUrls?.[0];
  const hoverImage = imageUrls?.[1] || mainImageUrl;
  const router = useRouter();

  const formattedTitle = shortDescription
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const handleNavigate = () => {
    const categorySlug = String(fabricCategory).trim().toLowerCase();
    router.push(`/fabrics/${categorySlug}/${formattedTitle}/${id}`);
  };

  return (
    <div
      className="relative w-full cursor-pointer group border border-gray-400 shadow-lg rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigate}
    >
      {hoverImage && hoverImage !== mainImageUrl && (
        <img
          src={hoverImage}
          alt={`Fabric ${shortDescription}`}
          style={{ display: 'none' }}
          loading="eager"
          aria-hidden="true"
        />
      )}

      <div
        className="w-full aspect-[27/40]  overflow-hidden rounded-t-md bg-center bg-cover transition-all duration-300"
        style={{
          backgroundImage: `url(${isHovered ? hoverImage : mainImageUrl})`,
        }}
      ></div>

      <div className="min-h-[60px] px-3 py-2 flex flex-row items-center justify-center rounded-b-md bg-white">
        <Text
          type="tiny"
          as="h3"
          fontWeight="normal"
          className="text-black text-left"
        >
          {fabricCategory}
        </Text>
      </div>
    </div>
  );
};

export default FabricCard;
