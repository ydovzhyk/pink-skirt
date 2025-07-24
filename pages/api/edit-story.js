import { db } from '@/utils/firebase/firebase-сonfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storyData = req.body;

    if (!storyData?.id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const { id, ...fieldsToUpdate } = storyData;

    await db.collection('stories').doc(id).update(fieldsToUpdate);

    return res.status(200).json({ message: 'Story successfully updated' });
  } catch (error) {
    console.error('❌ Error updating story:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update story in Firestore' });
  }
}
