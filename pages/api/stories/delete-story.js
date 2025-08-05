import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    await db.collection('stories').doc(id).delete();

    return res
      .status(200)
      .json({ message: 'Story successfully deleted from Firestore' });
  } catch (error) {
    console.error('❌ Error deleting story:', error);
    return res
      .status(500)
      .json({ error: 'Failed to delete story from Firestore' });
  }
}
