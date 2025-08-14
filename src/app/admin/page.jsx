'use client';

import { useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getLogin } from '../../redux/auth/auth-selectors';
import LoaderSpinner from '@/components/loader/loader';
import { Suspense } from 'react';
import MyStories from '@/components/my-stories/index.jsx';
import AddStory from '@/components/admin-page/stories/add-story/index.jsx';
import EditStory from '@/components/admin-page/stories/edit-story/index.jsx';
import AddReadyGoods from '@/components/admin-page/ready-goods/add-ready-goods/index.jsx';
import EditReadyGood from '@/components/admin-page/ready-goods/edit-ready-goods/index.jsx';
import MyReadyGoods from '@/components/my-ready-goods/index.jsx';
import MyModels from '@/components/my-model/index.jsx';
import AddModel from '@/components/admin-page/models/add-models/index.jsx';
import EditModel from '@/components/admin-page/models/edit-models/index.jsx';
import MyFabrics from '@/components/my-fabrics/index.jsx';
import AddFabric from '@/components/admin-page/fabrics/add-fabric/index.jsx';
import EditFabric from '@/components/admin-page/fabrics/edit-fabric/index.jsx';

function AdminPage() {
  const isLogin = useSelector(getLogin);
  const router = useRouter();

  useEffect(() => {
    if (isLogin === undefined || isLogin === null) return;

    if (!isLogin) {
      notFound();
    }
  }, [isLogin, router]);

  if (isLogin === undefined || isLogin === null) {
    return null;
  }

  return (
    <div className="">
      <Suspense fallback={<LoaderSpinner />}>
        {/* MyReadyGoods */}
        <div id="admin-collection" className="flex flex-col">
          <MyReadyGoods />
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <AddReadyGoods />
              <EditReadyGood />
            </div>
          </div>
        </div>
        {/* MyModels */}
        <div
          id="admin-models"
          className="flex flex-col"
          style={{
            background:
              'linear-gradient(to bottom, rgba(250, 247, 195, 0.3), var(--section-fourth))',
          }}
        >
          <MyModels />
          <div
            style={{
              background: `linear-gradient(to top, rgba(250, 247, 195, 0.3), var(--section-fourth))`,
            }}
          >
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <AddModel />
                <EditModel />
              </div>
            </div>
          </div>
        </div>
        {/* MyFabrics */}
        <div id="admin-fabrics" className="flex flex-col">
          <MyFabrics />
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <AddFabric />
              <EditFabric />
            </div>
          </div>
        </div>

        <div
          id="admin-stories"
          className="flex flex-col bg-[var(--section-third)]"
        >
          <MyStories />
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 -mt-12 lg:-mt-16">
              <AddStory />
              <EditStory />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default AdminPage;
