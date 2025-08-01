'use client';

import { useEffect, useState, useRef } from 'react';
import Text from '@/components/shared/text/text';


const ModelCard = ({ model }) => {
  const { media, title, description } = model;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia.endsWith('.mp4');

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

      {/* Оверлей з описом */}
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
    </div>
  );
};

export default ModelCard;
