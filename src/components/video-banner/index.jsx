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

  // early preload distance for middle/bottom
  preloadRootMargin = '1400px 0px 1400px 0px',
  // attach/play distance (your old 300px default)
  playRootMargin = '300px 0px 300px 0px',

  // optional posters (recommend setting at least topPoster)
  topPoster = '/images/banner-top-poster.jpg',
  middlePoster = undefined,
  bottomPoster = undefined,
}) => {
  const screenType = useSelector(getScreenType);
  const isLoginPanel = useSelector(getIsLoginPanel);

  // real sources
  const realVideoSrc =
    type === 'top'
      ? '/video/banner-top.mp4'
      : type === 'middle'
        ? '/video/banner-middle.mp4'
        : '/video/banner-bottom.mp4';

  const posterSrc =
    type === 'top'
      ? topPoster
      : type === 'middle'
        ? middlePoster
        : bottomPoster;

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const playLockRef = useRef(false);

  const [sectionH, setSectionH] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(clamp01(defaultVolume));
  const KEY_VOLUME = `${storageKey}Volume`;

  const [videoAR, setVideoAR] = useState(null);

  // Two-stage loading:
  // - shouldPreload: start loading earlier
  // - shouldPlay: start autoplay when close/in view
  const [shouldPreload, setShouldPreload] = useState(type === 'top');
  const [shouldPlay, setShouldPlay] = useState(type === 'top');

  // restore volume
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem(KEY_VOLUME);
      if (savedVol !== null) setVolume(clamp01(Number(savedVol)));
    } catch {}
  }, [KEY_VOLUME]);

  // Observer 1: preload earlier (middle/bottom)
  useEffect(() => {
    if (type === 'top') return; // top: always true
    if (shouldPreload) return;
    if (!sectionRef.current) return;

    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldPreload(true);
            observer.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: preloadRootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [type, shouldPreload, preloadRootMargin]);

  // Observer 2: start play closer/in view (middle/bottom)
  useEffect(() => {
    if (type === 'top') return;
    if (shouldPlay) return;
    if (!sectionRef.current) return;

    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldPlay(true);
            observer.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin: playRootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [type, shouldPlay, playRootMargin]);

  // Height logic:
  // - TOP: CSS height calc(100svh - 85px) => no CLS from "null -> measured"
  useEffect(() => {
    if (type === 'top') return;

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
    type,
    headerSelector,
    isLoginPanel,
    mobileLandscapeHeight,
    smallDeviceMinSide,
    capToVideoAspect,
    fallbackAspect,
    videoAR,
  ]);

  // sync video + autoplay only when shouldPlay
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = isMuted;

    try {
      el.volume = clamp01(volume);
    } catch {}

    try {
      localStorage.setItem(KEY_VOLUME, String(clamp01(volume)));
    } catch {}

    // autoplay policy: only try autoplay when muted
    if (shouldPlay && el.paused && isMuted && !playLockRef.current) {
      playLockRef.current = true;
      el.play()
        .catch(() => {})
        .finally(() => {
          playLockRef.current = false;
        });
    }
  }, [isMuted, volume, KEY_VOLUME, shouldPlay]);

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

  // section style:
  // TOP: stable CSS height (no CLS)
  // OTHERS: measured height when available
  const sectionStyle =
    type === 'top'
      ? {
          height: 'calc(100svh - 85px)',
          minHeight: `${mobileLandscapeHeight}px`,
        }
      : sectionH != null
        ? { height: `${sectionH}px` }
        : undefined;

  // src attachment:
  // TOP: immediately
  // MIDDLE/BOTTOM: attach earlier at shouldPreload, play later at shouldPlay
  const shouldAttachSrc = type === 'top' ? true : shouldPreload;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="w-full overflow-hidden relative"
      style={sectionStyle}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        style={{ objectFit }}
        // attach src earlier (preload stage)
        src={shouldAttachSrc ? realVideoSrc : undefined}
        // play only when shouldPlay
        autoPlay={shouldPlay}
        loop
        muted={isMuted}
        playsInline
        // TOP: load more aggressively; others: preload when we decided to attach
        preload={
          type === 'top' ? 'auto' : shouldAttachSrc ? 'metadata' : 'none'
        }
        // poster helps avoid flashes before first frame (especially top)
        poster={posterSrc}
        onLoadedMetadata={e => {
          const v = e.currentTarget;
          if (v.videoWidth && v.videoHeight) {
            setVideoAR(v.videoWidth / v.videoHeight);
          }
        }}
        onCanPlay={() => {
          if (!shouldPlay) return;
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