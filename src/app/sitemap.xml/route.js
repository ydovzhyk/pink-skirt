import { db } from '@/utils/firebase/firebase-сonfig';

const CONTENT_UPDATED = '2026-10-08';

function toLastMod(value) {
  if (!value) return null;
  let date;
  if (typeof value.toDate === 'function') date = value.toDate();
  else if (typeof value._seconds === 'number')
    date = new Date(value._seconds * 1000);
  else if (typeof value.seconds === 'number') date = new Date(value.seconds * 1000);
  else date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  const baseUrl = 'https://pinkskirt.uk';

  const urls = [
    {
      loc: `${baseUrl}/`,
      lastmod: CONTENT_UPDATED,
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
        lastmod: toLastMod(data.updatedAt) || toLastMod(data.createdAt),
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
        lastmod: toLastMod(data.date) || toLastMod(data.createdAt),
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
      lastmod: toLastMod(d.updatedAt) || toLastMod(d.createdAt),
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
  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
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
