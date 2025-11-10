'use client';

import { useEffect, useRef, useState } from 'react';
import Text from '../shared/text/text';
import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';

const clamp01 = n => Math.min(1, Math.max(0, n));

const VideoBanner = ({
  type = 'top',
  id,
  showAudioControls = false,
  storageKey = 'banner',
  defaultVolume = 0.15,
  headerSelector = '#site-header',
  mobileLandscapeHeight = 500,
  smallDeviceMinSide = 480,
  capToVideoAspect = false,
  fallbackAspect = 16 / 9,
  objectFit = 'cover',
}) => {
  const screenType = useSelector(getScreenType);
  const isLoginPanel = useSelector(getIsLoginPanel);

  // реальні шляхи
  const realVideoSrc =
    type === 'top'
      ? '/video/banner-top.mp4'
      : type === 'middle'
        ? '/video/banner-middle.mp4'
        : '/video/banner-bottom.mp4';

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const playLockRef = useRef(false);

  const [sectionH, setSectionH] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(clamp01(defaultVolume));
  const KEY_VOLUME = `${storageKey}Volume`;

  const [videoAR, setVideoAR] = useState(null);

  // головне: чи в viewport
  // top-банер майже завжди у вʼюпорті, тому одразу true
  const [isInView, setIsInView] = useState(type === 'top');

  // відновлюємо гучність
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem(KEY_VOLUME);
      if (savedVol !== null) setVolume(clamp01(Number(savedVol)));
    } catch {}
  }, [KEY_VOLUME]);

  // IntersectionObserver
  useEffect(() => {
    // top уже true — нічого не дивимось
    if (isInView) return;
    if (!sectionRef.current) return;

    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        // підвантажуємо заздалегідь, десь за 300px до появи
        rootMargin: '300px 0px 300px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isInView]);

  // розрахунок висоти як у тебе
  useEffect(() => {
    const measure = () => {
      const vv = window.visualViewport;
      const vpH = vv?.height || window.innerHeight;
      const vpW = vv?.width || window.innerWidth;

      const isLandscape = vpW > vpH;
      const minSide = Math.min(vpW, vpH);
      const isSmallDevice = minSide <= smallDeviceMinSide;

      const headerEl =
        document.querySelector(headerSelector) ||
        document.querySelector('header');
      const rawHeaderH = headerEl?.getBoundingClientRect().height ?? 0;
      const fallbackHeaderH = isLoginPanel ? 148 : 85;
      const headerH = Math.round(rawHeaderH || fallbackHeaderH);

      let h;
      if (isLandscape && isSmallDevice) {
        h = mobileLandscapeHeight;
      } else {
        h = Math.max(0, Math.round(vpH - headerH));
      }

      if (capToVideoAspect && isLandscape && !isSmallDevice) {
        const ar = videoAR || fallbackAspect;
        const aspectCap = Math.round(vpW / ar);
        if (aspectCap < h) h = aspectCap;
      }

      setSectionH(h);
    };

    measure();

    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', onResize);

    let ro;
    const headerEl =
      document.querySelector(headerSelector) ||
      document.querySelector('header');
    if (headerEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(onResize);
      ro.observe(headerEl);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', onResize);
      ro?.disconnect();
    };
  }, [
    headerSelector,
    isLoginPanel,
    mobileLandscapeHeight,
    smallDeviceMinSide,
    capToVideoAspect,
    fallbackAspect,
    videoAR,
  ]);

  // sync відео тільки коли воно вже в полі зору і є реальний src
  useEffect(() => {
    if (!isInView) return;
    const el = videoRef.current;
    if (!el) return;

    el.muted = isMuted;

    try {
      el.volume = clamp01(volume);
    } catch {}

    try {
      localStorage.setItem(KEY_VOLUME, String(clamp01(volume)));
    } catch {}

    if (el.paused && isMuted && !playLockRef.current) {
      playLockRef.current = true;
      el.play()
        .catch(() => {})
        .finally(() => {
          playLockRef.current = false;
        });
    }
  }, [isMuted, volume, KEY_VOLUME, isInView]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const next = !isMuted;
    setIsMuted(next);
    el.muted = next;
    if (!next) el.play().catch(() => {});
  };

  const onVolumeChange = e => {
    const v = clamp01(Number(e.target.value));
    setVolume(v);
    if (videoRef.current) {
      try {
        videoRef.current.volume = v;
      } catch {}
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="w-full overflow-hidden relative"
      style={sectionH != null ? { height: `${sectionH}px` } : undefined}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        style={{ objectFit }}
        // головне місце: src тільки коли видно (або вже близько)
        src={isInView ? realVideoSrc : undefined}
        autoPlay={isInView}
        loop
        muted={isMuted}
        playsInline
        preload={isInView ? 'metadata' : 'none'}
        onLoadedMetadata={e => {
          const v = e.currentTarget;
          if (v.videoWidth && v.videoHeight) {
            setVideoAR(v.videoWidth / v.videoHeight);
          }
        }}
        onCanPlay={() => {
          if (!isInView) return;
          const el = videoRef.current;
          if (el && el.paused && isMuted && !playLockRef.current) {
            playLockRef.current = true;
            el.play()
              .catch(() => {})
              .finally(() => {
                playLockRef.current = false;
              });
          }
        }}
      />

      {showAudioControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="rounded-full w-[35px] h-[35px] flex items-center justify-center bg-white/10 hover:bg-white/25 backdrop-blur-[1px] border-[0.5px] border-white/40 transition focus:outline-none focus:ring-[0.5px] focus:ring-white/70"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <HiOutlineSpeakerXMark color="white" />
            ) : (
              <HiOutlineSpeakerWave color="white" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-[1px] border border-white/30">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              aria-label="Volume"
              className="w-32 thin-range"
              style={{ '--val': `${Math.round(volume * 100)}` }}
            />
            <div className="flex items-center justify-center w-[30px]">
              <span className="text-white text-xs tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {type === 'top' && (
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1280px] px-4 flex flex-col gap-4"
            style={{ bottom: screenType === 'isDesktop' ? '50px' : '50px' }}
          >
            <div
              style={{
                width:
                  screenType === 'isMobile'
                    ? '90%'
                    : screenType === 'isTablet'
                      ? '65%'
                      : screenType === 'isLaptop'
                        ? '50%'
                        : '45%',
              }}
            >
              <Text
                type="normal"
                as="h1"
                fontWeight="light"
                lineHeight="loose"
                className="text-[#FAFCFF] whitespace-pre-line"
                textShadow="black"
              >
                {
                  'Pink is my language.\nMy filter for the world.\nMy Pink Skirt.'
                }
              </Text>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoBanner;
