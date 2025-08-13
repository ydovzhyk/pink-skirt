import { db, storage } from '@/utils/firebase/firebase-сonfig';
import { gcsPathFromUrl } from '@/utils/path-from-url';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const id = req.body?.id || req.query?.id;
    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const docRef = db.collection('stories').doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const data = snap.data();

    const urls = [
      data?.mainImageUrl,
      ...(Array.isArray(data?.additionalImageUrls)
        ? data.additionalImageUrls
        : []),
    ].filter(Boolean);

    const paths = urls.map(u => gcsPathFromUrl(u)).filter(Boolean);

    const results = await Promise.allSettled(
      paths.map(p => storage.file(p).delete({ ignoreNotFound: true }))
    );

    const filesReport = results.map((r, i) =>
      r.status === 'fulfilled'
        ? { url: urls[i], path: paths[i], deleted: true }
        : {
            url: urls[i],
            path: paths[i],
            deleted: false,
            error: String(r.reason?.message || r.reason),
          }
    );

    await docRef.delete();

    return res.status(200).json({
      ok: true,
      message: 'Story and images deleted',
      filesReport,
    });
  } catch (error) {
    console.error('❌ Error deleting story:', error);
    return res.status(500).json({ error: 'Failed to delete story' });
  }
}
