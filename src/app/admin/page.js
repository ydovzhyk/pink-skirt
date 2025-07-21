'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getLogin } from '../../redux/auth/auth-selectors';
import LoaderSpinner from '@/components/loader/loader';
import { Suspense } from 'react';
import AddStory from '@/components/admin-page/stories/add-story/index.jsx';
import EditStory from '@/components/admin-page/stories/edit-story/index.jsx';

function AdminPage() {
  const isLogin = useSelector(getLogin);
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace('/');
    }
  }, [isLogin, router]);

  return (
    <div className="container">
      <Suspense fallback={<LoaderSpinner />}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AddStory />
          <EditStory />
        </div>
      </Suspense>
    </div>
  );
}

export default AdminPage;
