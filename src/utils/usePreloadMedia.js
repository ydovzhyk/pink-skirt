import { useState, useEffect, useRef } from 'react';

const preloadCache = new Set();

export function usePreloadMedia(mediaItems = []) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const loadPromises = mediaItems.map(item => {
      const src = item.imageUrl;
      if (!src || preloadCache.has(src)) return Promise.resolve();

      const extension = new URL(src).pathname.split('.').pop().toLowerCase();

      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            preloadCache.add(src);
            resolve();
          };
          img.onerror = resolve;
        });
      }

      if (['.mp4', '.webm', '.ogg', '.mov', '.m4v'].includes(extension)) {
        return new Promise(resolve => {
          const video = document.createElement('video');
          video.src = src;
          video.preload = 'auto';
          video.muted = true;
          video.style.display = 'none';
          document.body.appendChild(video);

          const finish = () => {
            preloadCache.add(src);
            resolve();
          };

          video.oncanplaythrough = finish;
          video.onerror = finish;

          video.load();
        });
      }

      return Promise.resolve();
    });

    Promise.all(loadPromises).then(() => {
      if (isMountedRef.current) setIsPreloaded(true);
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [mediaItems.map(m => m.imageUrl).join(',')]);

  return isPreloaded;
}

