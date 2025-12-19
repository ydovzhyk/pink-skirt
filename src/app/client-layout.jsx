'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { getLoadingAuth, getIsLoginPanel } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { getLoadingStories } from '../redux/stories/stories-selectors';
import { getLoadingReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getLoadingFabrics } from '../redux/fabrics/fabrics-selectors';
import { getLoadingModels } from '../redux/models/models-selectors';
import { setActiveSection } from '@/redux/technical/technical-slice';
import ActiveSectionObserver from '@/utils/active-section-observer';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '@/components/loader/loader';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ScrollToTopButton from '@/components/scroll-to-top-btn/scroll-to-top-btn';
import ScrollToHashSection from '@/utils/scroll-to-hash-section';
import InitialDataLoader from '@/utils/InitialDataLoader';
import SnowFlake from '@/components/snow-flake';

function isSnowSeason(date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const inDec = m === 12 && d >= 7;
  const inJan = m === 1;
  const inFeb = m === 2 && d <= 25;
  return inDec || inJan || inFeb;
}

const ON_MS = 3 * 60 * 1000; // 3 хв
const OFF_MS = 5 * 60 * 1000; // 5 хв

const ClientLayout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const loadingStories = useSelector(getLoadingStories);
  const loadingReadyGoods = useSelector(getLoadingReadyGoods);
  const loadingFabrics = useSelector(getLoadingFabrics);
  const loadingModels = useSelector(getLoadingModels);
  const isLoginPanel = useSelector(getIsLoginPanel);

  const [loading, setLoading] = useState(false);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

  // сезон снігу (07.12–25.02)
  const [snowSeason, setSnowSeason] = useState(false);
  // пульс (3 хв ON / 5 хв OFF)
  const [snowPulse, setSnowPulse] = useState(true);

  const shouldLoadInitialData =
    pathname !== '/' && !pathname.startsWith('/admin');

  useEffect(() => {
    const isLoading =
      loadingAuth ||
      loadingTechnical ||
      loadingStories ||
      loadingReadyGoods ||
      loadingFabrics ||
      loadingModels;

    setLoading(isLoading);
  }, [
    loadingAuth,
    loadingTechnical,
    loadingStories,
    loadingReadyGoods,
    loadingFabrics,
    loadingModels,
  ]);

  useEffect(() => {
    const checkWidth = () => setAfterMobileHeader(window.innerWidth > 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Перевіряємо сезон (і оновлюємо опівночі)
  useEffect(() => {
    const update = () => setSnowSeason(isSnowSeason(new Date()));
    update();

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const msToMidnight = nextMidnight.getTime() - now.getTime();

    let dailyIntervalId = null;
    const t = setTimeout(() => {
      update();
      dailyIntervalId = setInterval(update, 24 * 60 * 60 * 1000);
    }, msToMidnight);

    return () => {
      clearTimeout(t);
      if (dailyIntervalId) clearInterval(dailyIntervalId);
    };
  }, []);

  // 2) Пульс 3 хв ON / 5 хв OFF (працює тільки коли сезон і не /admin)
  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');
    if (!snowSeason || isAdmin) {
      setSnowPulse(false);
      return;
    }

    let stopped = false;
    let timerId = null;

    const schedule = nextOn => {
      setSnowPulse(nextOn);
      timerId = setTimeout(
        () => {
          if (stopped) return;
          schedule(!nextOn);
        },
        nextOn ? ON_MS : OFF_MS
      );
    };

    // стартуємо з ON
    schedule(true);

    return () => {
      stopped = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [snowSeason, pathname]);

  const snowAllowed = snowSeason && snowPulse && !pathname.startsWith('/admin');

  return (
    <div className="reletive min-h-screen flex flex-col justify-between">
      {loading && <LoaderSpinner />}
      <ToastContainer />
      <MediaQuery />
      <AuthProvider />
      {shouldLoadInitialData && <InitialDataLoader />}
      <ScrollToHashSection />
      <ActiveSectionObserver
        setActiveSection={section => dispatch(setActiveSection(section))}
      />

      {/* Snow: season + pulse + not admin */}
      <SnowFlake enabled={snowAllowed} />

      <Header />
      <main
        className={`flex-1 ${
          isLoginPanel && afterMobileHeader ? 'mt-[148px]' : 'mt-[85px]'
        }`}
      >
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default ClientLayout;
