'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateIsLoginPanel } from '@/redux/auth/auth-slice';
import { useRouter } from 'next/navigation';

const AuthProvider = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // 🔑 Відкриття адмін панелі при запиті в URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const password = params.get('password');

    const processData = async () => {
      localStorage.setItem('pink-skirt', 'true');
      dispatch(updateIsLoginPanel(true));
      router.replace('/');
    };

    const handleAction = async () => {
      if (action === 'authorize' && password === adminPassword) {
        await processData();
      }
    };

    handleAction();
  }, [dispatch, router, adminPassword]);

  // 🔁 Ініціалізація адміна при перезавантаженні
  useEffect(() => {
    const pinkSkirt = localStorage.getItem('pink-skirt');
    if (pinkSkirt === 'true') {
      dispatch(updateIsLoginPanel(true));
    }
  }, [dispatch]);

  return null;
};

export default AuthProvider;
