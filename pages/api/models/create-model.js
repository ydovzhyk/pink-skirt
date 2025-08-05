import { db } from '@/utils/firebase/firebase-сonfig';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const modelData = req.body;

    if (!modelData?.id) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    const dataToSave = {
      ...modelData,
      project: 'pink-skirt',
      createdAt: Timestamp.now(),
    };

    await db.collection('models').doc(modelData.id).set(dataToSave);

    return res
      .status(200)
      .json({ message: 'Model successfully saved to Firestore' });
  } catch (error) {
    console.error('❌ Error saving model:', error);
    return res.status(500).json({ error: 'Failed to save model' });
  }
}
