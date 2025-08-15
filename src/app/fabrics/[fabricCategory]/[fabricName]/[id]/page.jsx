'use client';

import { Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import LoaderSpinner from '@/components/loader/loader';
import { getCurrentFabric } from '@/redux/fabrics/fabrics-selectors';
import { getFabric } from '@/redux/fabrics/fabrics-operations';
import { clearCurrentFabric } from '@/redux/fabrics/fabrics-slice';
import FabricDetail from '@/components/my-fabrics/fabric-detail';

function DetailFabricsPage() {
  const { fabricName, id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentFabric = useSelector(getCurrentFabric);

  useEffect(() => {
    if (
      !fabricName ||
      typeof fabricName !== 'string' ||
      !id ||
      typeof id !== 'string'
    ) {
      router.replace('/404');
      return;
    }
    dispatch(clearCurrentFabric());
    dispatch(getFabric({ id }));
  }, [dispatch, id, fabricName, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (!currentFabric) {
    return null;
  } else {
    return (
      <div className="w-full">
        <div className="container border border-transparent">
          <Suspense fallback={<LoaderSpinner />}>
            <FabricDetail {...currentFabric} />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default DetailFabricsPage;