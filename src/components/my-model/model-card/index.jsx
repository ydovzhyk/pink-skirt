'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { usePreloadMedia } from '@/utils/usePreloadMedia';
import { deleteModel } from '@/redux/models/models-operations';
import { getModels } from '@/redux/models/models-operations';
import { setEditModel } from '@/redux/models/models-slice';
import Text from '@/components/shared/text/text';

const ModelCard = ({ model }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { media, title, description } = model;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const mediaSources = model.media?.map(url => ({ imageUrl: url })) ?? [];
  usePreloadMedia(mediaSources);

  const isAdmin = pathname.startsWith('/admin');

  const currentMedia = media[currentIndex];

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
  const cleanUrl = currentMedia?.split('?')[0] || '';
  const isVideo = videoExtensions.some(ext =>
    cleanUrl.toLowerCase().endsWith(ext)
  );

  useEffect(() => {
    if (!isHovered) {
      setCurrentIndex(0);
      clearTimeout(timeoutRef.current);
      return;
    }

    if (!isVideo) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % media.length);
      }, 2000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isHovered, currentIndex, isVideo]);

  const handleVideoEnd = () => {
    setCurrentIndex(prev => (prev + 1) % media.length);
  };

  const handleEdit = () => {
      dispatch(setEditModel(model));
      setTimeout(() => {
        const editSection = document.getElementById('edit-model');
        if (editSection) {
          editSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    };

  const handleDelete = async () => {
      await dispatch(deleteModel(model.id)).unwrap();
      await dispatch(getModels()).unwrap();
    };

  return (
    <div
      className="relative w-full h-[480px] rounded-md overflow-hidden shadow-lg group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isVideo ? (
        <video
          key={currentMedia}
          src={currentMedia}
          className="w-full h-full object-cover"
          autoPlay
          muted
          onEnded={handleVideoEnd}
        />
      ) : (
        <img
          src={currentMedia}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      )}

      <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-70 p-2 flex flex-col gap-1 h-[90px] rounded-b-md-md">
        <Text
          type="small"
          as="p"
          fontWeight="bold"
          className="text-gray-700 text-left"
        >
          {title}
        </Text>
        <Text
          type="extra-small"
          as="p"
          fontWeight="normal"
          lineHeight="normal"
          className="text-[var(--text-title)] whitespace-pre-line"
        >
          {description}
        </Text>
      </div>
      {isAdmin && (
        <div className="absolute top-[-15px] left-0 w-full flex flex-row gap-[80px] items-center justify-center mt-4 rounded-md bg-white shadow-lg p-2">
          <button
            className="border-b border-green-600 hover:border-black w-fit transition-colors duration-200"
            onClick={handleEdit}
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
            onClick={handleDelete}
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

export default ModelCard;
