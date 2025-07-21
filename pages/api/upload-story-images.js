import { v4 as uuidv4 } from 'uuid';
import { readFile, unlink } from 'fs/promises';
import { storage } from '@/utils/firebase/firebase-сonfig';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = req => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve([fields, files]);
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [fields, files] = await parseForm(req);
    const folderName = fields.folderName?.[0] || '';
    const mainFileName = fields.mainFileName?.[0];
    const imageList = files.images
      ? Array.isArray(files.images)
        ? files.images
        : [files.images]
      : [];

    const uploaded = [];

    for (const file of imageList) {
      const id = uuidv4();
      const destination = `pink-skirt/${folderName}/${id}-${file.originalFilename}`;
      const buffer = await readFile(file.filepath);

      const firebaseFile = storage.file(destination);
      await firebaseFile.save(buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      const [url] = await firebaseFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });

      uploaded.push({ name: file.originalFilename, url });

      try {
        await unlink(file.filepath);
      } catch (e) {
        console.warn(
          '⚠️ Warning: Could not delete temporary file',
          file.filepath,
          e
        );
      }
    }

    const mainImage = uploaded.find(f => f.name === mainFileName);
    const additionalImages = uploaded
      .filter(f => f.name !== mainFileName)
      .map(f => f.url);

    return res.status(200).json({
      mainImageUrl: mainImage?.url || '',
      additionalImageUrls: additionalImages,
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}




