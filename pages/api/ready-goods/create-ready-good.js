import { db } from '@/utils/firebase/firebase-сonfig';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const goodData = req.body;

    if (!goodData?.id) {
      return res.status(400).json({ error: 'Good ID is required' });
    }

    const dataToSave = {
      ...goodData,
      project: 'pink-skirt',
      createdAt: Timestamp.now(),
    };

    await db.collection('ready-goods').doc(goodData.id).set(dataToSave);

    return res
      .status(200)
      .json({ message: 'Ready Good successfully saved to Firestore' });
  } catch (error) {
    console.error('❌ Error saving ready good:', error);
    return res.status(500).json({ error: 'Failed to save ready good' });
  }
}
