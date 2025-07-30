'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentPageReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { setEditReadyGood } from '@/redux/ready-goods/ready-goods-slice';
import {
  deleteReadyGood,
  getReadyGoods,
} from '@/redux/ready-goods/ready-goods-operations';
import Text from '@/components/shared/text/text';

const NewestReadyGoodCard = ({
  id,
  title,
  description,
  mainImageUrl,
  additionalImageUrls = [],
  readyGood,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverImage = additionalImageUrls?.[0] || mainImageUrl;
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPage = useSelector(getCurrentPageReadyGoods);

  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const formattedTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  const handleNavigate = () => {
    router.push(`/ready-goods/${formattedTitle}/${id}`);
  };

  const handleEdit = () => {
    dispatch(setEditReadyGood(readyGood));
    setTimeout(() => {
      const editSection = document.getElementById('edit-ready-good');
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handleDelete = async () => {
    await dispatch(deleteReadyGood(id)).unwrap();
    await dispatch(getReadyGoods({ page: currentPage, limit: 6 })).unwrap();
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer group shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hoverImage && hoverImage !== mainImageUrl && (
        <img
          src={hoverImage}
          alt="newest-ready-good-photo"
          style={{ display: 'none' }}
          loading="eager"
          aria-hidden="true"
        />
      )}

      <div
        className="relative w-full h-full overflow-hidden rounded-md border border-gray-300 bg-center bg-cover transition-all duration-300 p-[20px]"
        style={{
          backgroundImage: `url(${isHovered ? hoverImage : mainImageUrl})`,
        }}
      >
        <div className="w-full h-full border-[2px] border-white p-[30px] shadow-[0.5px_0.5px_0.5px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col justify-center items-center h-full gap-[30px]">
            <Text
              type="title"
              as="h3"
              fontWeight="normal"
              className="text-[#FAFCFF] text-center"
              textShadow={true}
            >
              New in Collection
            </Text>

            <Text
              type="small"
              as="p"
              fontWeight="light"
              className="text-[#FAFCFF] text-left"
              textShadow={true}
            >
              {title}
            </Text>

            <Text
              type="tiny"
              as="p"
              fontWeight="light"
              lineHeight="snug"
              className="text-[#FAFCFF] whitespace-pre-line w-[70%]"
              textShadow={true}
            >
              {String(description.slice(0, 150)) + '...'}
            </Text>

            <button
              className="border-b border-[#FAFCFF] hover:border-[var(--accent)] w-fit transition-colors duration-200"
              onClick={handleNavigate}
            >
              <Text
                type="extra-small"
                as="p"
                fontWeight="light"
                className="text-[#FAFCFF]"
                textShadow={true}
              >
                Read more
              </Text>
            </button>
          </div>
        </div>
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

export default NewestReadyGoodCard;
