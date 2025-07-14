'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import LoaderSpinner from '@/components/loader/loader';
import ModalWindow from '@/components/modal-window-message/modal-window-message';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import Header from '../components/header/header';
// import Footer from '../components/footer/footer';
import ScrollToTopButton from '@/components/scroll-to-top-btn/scroll-to-top-btn';
import SearchParamsHandler from '@/utils/search-params-handler';

const ClientLayout = ({ children }) => {
  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loadingAuth || loadingTechnical);
  }, [loadingAuth, loadingTechnical]);

  return (
    <div className="reletive min-h-screen flex flex-col justify-between">
      {loading && <LoaderSpinner />}
      <ModalWindow />
      <MediaQuery />
      <AuthProvider />
        <Suspense fallback={<LoaderSpinner />}>
          <SearchParamsHandler />
        </Suspense>
        <Header />
        <main className="flex-1">{children}</main>
        <ScrollToTopButton />
        {/* <Footer /> */}
    </div>
  );
};

export default ClientLayout;

