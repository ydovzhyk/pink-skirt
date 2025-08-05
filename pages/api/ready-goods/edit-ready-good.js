import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const goodData = req.body;

    if (!goodData?.id) {
      return res.status(400).json({ error: 'Good ID is required' });
    }

    const { id, ...fieldsToUpdate } = goodData;

    await db.collection('ready-goods').doc(id).update(fieldsToUpdate);

    return res
      .status(200)
      .json({ message: 'Ready Good successfully updated in Firestore' });
  } catch (error) {
    console.error('❌ Error updating ready good:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update ready good in Firestore' });
  }
}