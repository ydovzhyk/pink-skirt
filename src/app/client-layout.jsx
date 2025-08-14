'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { getLoadingStories } from '../redux/stories/stories-selectors';
import { getLoadingReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getLoadingFabrics } from '../redux/fabrics/fabrics-selectors';
import { getLoadingModels } from '../redux/models/models-selectors';
import {getIsLoginPanel} from '@/redux/auth/auth-selectors';
import { ToastContainer } from 'react-toastify';
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

const ClientLayout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const loadingStories = useSelector(getLoadingStories);
  const loadingReadyGoods = useSelector(getLoadingReadyGoods);
  const loadingFabrics = useSelector(getLoadingFabrics);
  const loadingModels = useSelector(getLoadingModels);
  const [loading, setLoading] = useState(false);
  const isLoginPanel = useSelector(getIsLoginPanel);
  const [afterMobileHeader, setAfterMobileHeader] = useState(false);

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
    const checkWidth = () => {
      setAfterMobileHeader(window.innerWidth > 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

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
      <Header />
      <main
        className={`flex-1 ${isLoginPanel && afterMobileHeader ? 'mt-[148px]' : 'mt-[85px]'}`}
      >
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default ClientLayout;

