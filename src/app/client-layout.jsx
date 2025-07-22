'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { getLoadingStories } from '../redux/stories/stories-selectors';
import {getIsLoginPanel} from '@/redux/auth/auth-selectors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '@/components/loader/loader';
import ModalWindow from '@/components/modal-window-message/modal-window-message';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ScrollToTopButton from '@/components/scroll-to-top-btn/scroll-to-top-btn';
import SearchParamsHandler from '@/utils/search-params-handler';

const ClientLayout = ({ children }) => {
  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const loadingStories = useSelector(getLoadingStories);
  const [loading, setLoading] = useState(false);
  const isLoginPanel = useSelector(getIsLoginPanel);

  useEffect(() => {
    setLoading(loadingAuth || loadingTechnical || loadingStories);
  }, [loadingAuth, loadingTechnical, loadingStories]);

  return (
    <div className="reletive min-h-screen flex flex-col justify-between">
      {loading && <LoaderSpinner />}
      <ToastContainer />
      <ModalWindow />
      <MediaQuery />
      <AuthProvider />
      <Suspense fallback={<LoaderSpinner />}>
        <SearchParamsHandler />
      </Suspense>
      <Header />
      <main className={`flex-1 ${isLoginPanel ? 'mt-[149px]' : 'mt-[85px]'}`}>
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default ClientLayout;

