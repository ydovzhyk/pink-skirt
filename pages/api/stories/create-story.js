import { db } from '@/utils/firebase/firebase-сonfig';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storyData = req.body;

    if (!storyData?.id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const dataToSave = {
      ...storyData,
      project: 'pink-skirt',
      createdAt: Timestamp.now(),
    };

    await db.collection('stories').doc(storyData.id).set(dataToSave);

    return res
      .status(200)
      .json({ message: 'Story successfully saved to Firestore' });
  } catch (error) {
    console.error('❌ Error saving story:', error);
    return res.status(500).json({ error: 'Failed to save story to Firestore' });
  }
}
