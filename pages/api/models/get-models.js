import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const modelsRef = db.collection('models').orderBy('createdAt', 'desc');
    const snapshot = await modelsRef.get();

    const allModels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      allModels,
    });
  } catch (error) {
    console.error('❌ Error fetching models:', error);
    return res.status(500).json({ error: 'Failed to fetch models' });
  }
}