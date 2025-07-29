'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getLogin } from '../../redux/auth/auth-selectors';
import LoaderSpinner from '@/components/loader/loader';
import { Suspense } from 'react';
import {getAllStories} from '@/redux/stories/stories-selectors';
import { getAllReadyGoods } from '../../redux/ready-goods/ready-goods-selectors';
import MyStories from '@/components/my-stories/index.jsx';
import AddStory from '@/components/admin-page/stories/add-story/index.jsx';
import EditStory from '@/components/admin-page/stories/edit-story/index.jsx';
import AddReadyGoods from '@/components/admin-page/ready-goods/add-ready-goods/index.jsx';

function AdminPage() {
  const isLogin = useSelector(getLogin);
  const allStories = useSelector(getAllStories);
  const allReadyGoods = useSelector(getAllReadyGoods);
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace('/');
    }
  }, [isLogin, router]);

  return (
    <div className="">
      <Suspense fallback={<LoaderSpinner />}>
        <div id="admin-stories" className="flex flex-col gap-6">
          <MyStories />
          <div className="container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AddStory />
              <EditStory />
            </div>
          </div>
        </div>
        <div id="admin-ready-goods" className="flex flex-col gap-6">
          {/* <MyStories /> */}
          <div className="container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AddReadyGoods />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default AdminPage;
