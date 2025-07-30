'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { getLoadingStories } from '../redux/stories/stories-selectors';
import {getIsLoginPanel} from '@/redux/auth/auth-selectors';
import { ToastContainer } from 'react-toastify';
import { setActiveSection } from '@/redux/technical/technical-slice';
import ActiveSectionObserver from '@/utils/active-section-observer';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '@/components/loader/loader';
import ModalWindow from '@/components/modal-window-message/modal-window-message';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ScrollToTopButton from '@/components/scroll-to-top-btn/scroll-to-top-btn';
import ScrollToHashSection from '@/utils/scroll-to-hash-section';

const ClientLayout = ({ children }) => {
  const dispatch = useDispatch();
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
      <ScrollToHashSection />
      <ActiveSectionObserver
        setActiveSection={section => dispatch(setActiveSection(section))}
      />
      <Header />
      <main className={`flex-1 ${isLoginPanel ? 'mt-[148px]' : 'mt-[85px]'}`}>
        {children}
      </main>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default ClientLayout;

