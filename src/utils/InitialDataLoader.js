'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStories } from '@/redux/stories/stories-operations';
import { getReadyGoods } from '@/redux/ready-goods/ready-goods-operations';
import { getModels } from '@/redux/models/models-operations';
import { getFabrics } from '@/redux/fabrics/fabrics-operations';

import { getAllReadyGoods } from '@/redux/ready-goods/ready-goods-selectors';
import { getAllStories } from '@/redux/stories/stories-selectors';
import { getModelsList } from '@/redux/models/models-selectors';
import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';

const InitialDataLoader = () => {
  const dispatch = useDispatch();

  const readyGoods = useSelector(getAllReadyGoods);
  const stories = useSelector(getAllStories);
  const models = useSelector(getModelsList);
  const fabrics = useSelector(getAllFabrics);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;

    if (!stories.length) {
      dispatch(getStories({ page: 1, limit: 2 }));
    }

    if (!readyGoods.length) {
      dispatch(getReadyGoods({ page: 1, limit: 2 }));
    }

    if (!models.length) {
      dispatch(getModels());
    }

    if (!fabrics.length) {
      dispatch(getFabrics());
    }

    setChecked(true);
  }, [
    dispatch,
    stories.length,
    readyGoods.length,
    models.length,
    fabrics.length,
    checked,
  ]);

  return null;
};

export default InitialDataLoader;
