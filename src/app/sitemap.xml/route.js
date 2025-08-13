import { db } from '@/utils/firebase/firebase-сonfig';

export async function GET() {
  const baseUrl = 'https://pinkskirt.uk';

  const urls = [
    {
      loc: `${baseUrl}/`,
      changefreq: 'weekly',
      priority: 1.0,
    },
  ];

  // Ready Goods
  const readyGoodsSnap = await db.collection('ready-goods').get();
  readyGoodsSnap.forEach(doc => {
    const data = doc.data();
    if (data?.title && data?.id) {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${baseUrl}/ready-goods/${slug}/${data.id}`,
        changefreq: 'monthly',
        priority: 0.8,
      });
    }
  });

  // Stories
  const storiesSnap = await db.collection('stories').get();
  storiesSnap.forEach(doc => {
    const data = doc.data();
    if (data?.title && data?.id) {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${baseUrl}/story/${slug}/${data.id}`,
        changefreq: 'monthly',
        priority: 0.7,
      });
    }
  });

  // Models (опціонально)
  const modelsSnap = await db.collection('models').get();
  modelsSnap.forEach(doc => {
    const data = doc.data();
    if (data?.title && data?.id) {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${baseUrl}/models/${slug}/${data.id}`,
        changefreq: 'monthly',
        priority: 0.6,
      });
    }
  });

  // Формування XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `<url>
  <loc>${url.loc}</loc>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
</url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
