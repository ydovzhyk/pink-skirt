import { db } from '@/utils/firebase/firebase-сonfig';

function storyTime(value) {
  if (!value) return 0;
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value._seconds === 'number') return value._seconds * 1000;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '2');

  try {
    const snapshot = await db.collection('stories').get();
    const allStories = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() || {}),
      }))
      .sort((a, b) => {
        const byDate = storyTime(b.date) - storyTime(a.date);
        if (byDate !== 0) return byDate;
        return storyTime(b.createdAt) - storyTime(a.createdAt);
      });

    const total = allStories.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedStories = allStories.slice(start, start + limit);

    return res.status(200).json({
      total,
      page,
      limit,
      totalPages,
      stories: paginatedStories,
      allStories,
    });
  } catch (error) {
    console.error('❌ Error fetching stories:', error);
    return res.status(500).json({ error: 'Failed to fetch stories' });
  }
}
