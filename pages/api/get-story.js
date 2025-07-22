import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  console.log('Fetching story with ID:', id);

  if (!id) {
    return res.status(400).json({ error: 'Story ID is required' });
  }

  try {
    const docRef = db.collection('stories').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Story not found' });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('❌ Error fetching story:', error);
    return res.status(500).json({ error: 'Failed to fetch story' });
  }
}
