import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Good ID is required' });
    }

    await db.collection('ready-goods').doc(id).delete();

    return res
      .status(200)
      .json({ message: 'Ready Good successfully deleted from Firestore' });
  } catch (error) {
    console.error('❌ Error deleting ready good:', error);
    return res
      .status(500)
      .json({ error: 'Failed to delete ready good from Firestore' });
  }
}
