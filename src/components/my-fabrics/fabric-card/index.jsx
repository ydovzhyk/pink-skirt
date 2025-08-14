'use client';

import Text from '@/components/shared/text/text';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setEditFabric } from '@/redux/fabrics/fabrics-slice';
import { deleteFabric, getFabrics } from '@/redux/fabrics/fabrics-operations';

const FabricCard = ({ id, title, imageUrls, fabric }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const mainImageUrl = imageUrls?.[0];
  const hoverImage = imageUrls?.[1] || mainImageUrl;

  const router = useRouter();

  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const formattedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const handleNavigate = () => {
    router.push(`/fabrics/${formattedTitle}/${id}`);
  };

  const handleEdit = () => {
    dispatch(setEditFabric(fabric));
        setTimeout(() => {
          const editSection = document.getElementById('edit-fabric');
          if (editSection) {
            editSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
  };

  const handleDelete = async () => {
    await dispatch(deleteFabric(id)).unwrap();
    await dispatch(getFabrics()).unwrap();
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
          alt={`Fabric ${title}`}
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
          {title}
        </Text>
      </div>

      {isAdmin && (
        <div className="absolute top-[-15px] left-0 w-full flex flex-row gap-[80px] items-center justify-center mt-4 rounded-md bg-white shadow-lg p-2">
          <button
            className="border-b border-green-600 hover:border-black w-fit transition-colors duration-200"
            onClick={e => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-green-900"
            >
              Edit
            </Text>
          </button>
          <button
            className="border-b border-red-600 hover:border-black w-fit transition-colors duration-200"
            onClick={e => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Text
              type="extra-small"
              as="p"
              fontWeight="light"
              className="text-red-600"
            >
              Delete
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};

export default FabricCard;
