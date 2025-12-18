import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let page = parseInt(req.query.page || '1', 10);
  let limit = parseInt(req.query.limit || '6', 10);

  try {
    const goodsRef = db
      .collection('ready-goods')
      .orderBy('date', 'desc') // 1) новіші дати зверху
      .orderBy('createdAt', 'desc'); // 2) всередині дати — новіші першими

    const snapshot = await goodsRef.get();

    const allGoods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ✅ allGoods уже відсортовані як треба
    const newestReadyGoods = allGoods.filter(item => item.isNewest === true);
    let goodsWithoutNewest = allGoods.filter(item => item.isNewest !== true);

    // корекція ліміту, якщо немає newest
    const hasNewest = newestReadyGoods.length > 0;
    if (!hasNewest) {
      if (limit === 6) limit = 8;
      if (limit === 4) limit = 6;
    }

    const total = goodsWithoutNewest.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    let paginatedGoods;

    if (page === 1) {
      paginatedGoods = goodsWithoutNewest.slice(start, start + limit);
    } else {
      const remaining = goodsWithoutNewest.slice(start);
      const needed = limit - remaining.length;

      if (needed > 0) {
        const fallback = goodsWithoutNewest.slice(start - needed, start);
        paginatedGoods = [...fallback, ...remaining];
      } else {
        paginatedGoods = goodsWithoutNewest.slice(start, start + limit);
      }
    }

    return res.status(200).json({
      total,
      page,
      limit,
      allGoods,
      totalPages,
      goods: paginatedGoods,
      newestReadyGoods,
    });
  } catch (error) {
    console.error('❌ Firestore error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ error: error.code || 'internal', message: error.message });
  }
}

// import { db } from '@/utils/firebase/firebase-сonfig';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   let page = parseInt(req.query.page || '1');
//   let limit = parseInt(req.query.limit || '6');

//   try {
//     const goodsRef = db.collection('ready-goods').orderBy('createdAt', 'desc');
//     const snapshot = await goodsRef.get();

//     const allGoods = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // 1. Витягуємо найновіші товари
//     const newestReadyGoods = allGoods.filter(item => item.isNewest === true);

//     // 2. Решта
//     let goodsWithoutNewest = allGoods.filter(item => item.isNewest !== true);

//     // 3. Корекція ліміту якщо немає newest
//     const hasNewest = newestReadyGoods.length > 0;
//     if (!hasNewest) {
//       if (limit === 6) limit = 8;
//       if (limit === 4) limit = 6;
//     }

//     const total = goodsWithoutNewest.length;
//     const totalPages = Math.ceil(total / limit);

//     const start = (page - 1) * limit;
//     let paginatedGoods;

//     if (page === 1) {
//       paginatedGoods = goodsWithoutNewest.slice(start, start + limit);
//     } else {
//       const remaining = goodsWithoutNewest.slice(start);
//       const needed = limit - remaining.length;

//       if (needed > 0) {
//         const fallback = goodsWithoutNewest.slice(start - needed, start);
//         paginatedGoods = [...fallback, ...remaining];
//       } else {
//         paginatedGoods = goodsWithoutNewest.slice(start, start + limit);
//       }
//     }

//     return res.status(200).json({
//       total,
//       page,
//       limit,
//       allGoods,
//       totalPages,
//       goods: paginatedGoods,
//       newestReadyGoods,
//     });
//   } catch (error) {
//     console.error('❌ Error fetching ready goods:', error);
//     return res.status(500).json({ error: 'Failed to fetch ready goods' });
//   }
// }
