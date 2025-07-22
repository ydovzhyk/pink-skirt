import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '2');

  try {
    const storiesRef = db
      .collection('stories')
      .orderBy('createdAt', 'desc');

    const snapshot = await storiesRef.get();
    const allStories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() || [],
    }));

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
