'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateIsLoginPanel } from '@/redux/auth/auth-slice';
import { useRouter } from 'next/navigation';

const AuthProvider = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  console.log(adminPassword);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const password = params.get('password');

    const handleAction = async () => {
      if (action === 'authorize' && password === adminPassword) {
        localStorage.setItem('pink-skirt', 'true');
        dispatch(updateIsLoginPanel(true));

        // Зберігаємо поточну URL (включно з hash) і чистимо search-параметри
        const currentPath = window.location.pathname + window.location.hash;
        router.replace(currentPath);
      } else {
        dispatch(updateIsLoginPanel(false));
      }
    };

    handleAction();
  }, [dispatch, router, adminPassword]);

  useEffect(() => {
    const pinkSkirt = localStorage.getItem('pink-skirt');
    if (pinkSkirt === 'true') {
      dispatch(updateIsLoginPanel(true));
    }
  }, [dispatch]);

  return null;
};

export default AuthProvider;

