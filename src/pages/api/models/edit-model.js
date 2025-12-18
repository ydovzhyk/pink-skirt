import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const modelData = req.body;

    if (!modelData?.id) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    const { id, ...fieldsToUpdate } = modelData;

    await db.collection('models').doc(id).update(fieldsToUpdate);

    return res
      .status(200)
      .json({ message: 'Model successfully updated in Firestore' });
  } catch (error) {
    console.error('❌ Error updating model:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update model in Firestore' });
  }
}