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

  // Fabrics
  const fabricsSnap = await db.collection('fabrics').get();

  fabricsSnap.forEach(doc => {
    const d = doc.data() || {};
    if (!d.id || !d.name) return;

    const categorySlug = String(d.name).trim().toLowerCase();

    const detailSlug = String(d.shortDescription || d.description || d.name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    urls.push({
      loc: `${baseUrl}/fabrics/${categorySlug}/${detailSlug || d.id}/${d.id}`,
      changefreq: 'monthly',
      priority: 0.8,
    });
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
