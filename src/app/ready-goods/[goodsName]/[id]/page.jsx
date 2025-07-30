'use client';

import { Suspense, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import LoaderSpinner from '@/components/loader/loader';
import { getCurrentReadyGood } from '@/redux/ready-goods/ready-goods-selectors';
import { getReadyGood } from '@/redux/ready-goods/ready-goods-operations';
import { clearCurrentReadyGood } from '@/redux/ready-goods/ready-goods-slice';
import ReadyGoodsDetail from '@/components/my-ready-goods/ready-good-detail/index';

function DetailReadyGoodsPage() {
  const { goodsName, id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const currentGoods = useSelector(getCurrentReadyGood);

  useEffect(() => {
    if (
      !goodsName ||
      typeof goodsName !== 'string' ||
      !id ||
      typeof id !== 'string'
    ) {
      console.log('Invalid parameters');
      router.replace('/404');
      return;
    }
    dispatch(clearCurrentReadyGood());
    dispatch(getReadyGood({ id }));
  }, [dispatch, id, goodsName, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (!currentGoods) {
    return null;
  } else {
    return (
      <div className="w-full">
        <div className="container border border-transparent">
          <Suspense fallback={<LoaderSpinner />}>
            <ReadyGoodsDetail {...currentGoods} />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default DetailReadyGoodsPage;