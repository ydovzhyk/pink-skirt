import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let page = parseInt(req.query.page || '1');
  let limit = parseInt(req.query.limit || '6');

  try {
    const goodsRef = db.collection('ready-goods').orderBy('createdAt', 'desc');
    const snapshot = await goodsRef.get();

    const allGoods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 1. Витягуємо найновіші товари
    const newestReadyGoods = allGoods.filter(item => item.isNewest === true);

    // 2. Решта
    let goodsWithoutNewest = allGoods.filter(item => item.isNewest !== true);

    // 3. Корекція ліміту якщо немає newest
    const hasNewest = newestReadyGoods.length > 0;
    if (!hasNewest) {
      if (limit === 6) limit = 8;
      if (limit === 2) limit = 4;
    }

    const total = goodsWithoutNewest.length;
    const totalPages = Math.ceil(total / limit);

    // === Кастомна логіка для другої сторінки та далі ===
    const start = (page - 1) * limit;
    let paginatedGoods;

    if (page === 1) {
      paginatedGoods = goodsWithoutNewest.slice(start, start + limit);
    } else {
      const remaining = goodsWithoutNewest.slice(start);
      const needed = limit - remaining.length;

      if (needed > 0) {
        // fallback має йти ПЕРЕД remaining, з правильним порядком
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
      totalPages,
      goods: paginatedGoods,
      newestReadyGoods,
    });
  } catch (error) {
    console.error('❌ Error fetching ready goods:', error);
    return res.status(500).json({ error: 'Failed to fetch ready goods' });
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

//     // 1. Витягуємо нові товари
//     const newestReadyGoods = allGoods.filter(item => item.isNewest === true);

//     // 2. Вилучаємо їх з масиву для пагінації
//     let goodsWithoutNewest = allGoods.filter(item => item.isNewest !== true);

//     // 3. Якщо немає newest, змінюємо ліміт
//     if (newestReadyGoods.length === 0) {
//       if (limit === 6) limit = 8;
//       if (limit === 2) limit = 4;
//     }

//     const total = goodsWithoutNewest.length;
//     const totalPages = Math.ceil(total / limit);
//     const start = (page - 1) * limit;
//     const paginatedGoods = goodsWithoutNewest.slice(start, start + limit);

//     return res.status(200).json({
//       total,
//       page,
//       limit,
//       totalPages,
//       goods: paginatedGoods,
//       newestReadyGoods,
//       allGoods,
//     });
//   } catch (error) {
//     console.error('❌ Error fetching ready goods:', error);
//     return res.status(500).json({ error: 'Failed to fetch ready goods' });
//   }
// }
