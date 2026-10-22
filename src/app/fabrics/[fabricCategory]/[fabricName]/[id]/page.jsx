import { redirect } from 'next/navigation';
import DetailFabricsPage from './detail-client';
import { db } from '@/utils/firebase/firebase-сonfig';
import { fabricUrl, pathSlug, slugify } from '@/utils/seo/public-url';

const FALLBACK_TITLE = 'Pink Skirt – Bespoke Women’s Clothing by Inna Kuzmuk';
const FALLBACK_DESCRIPTION =
  'Pink Skirt – a unique atelier by Inna Kuzmuk, specializing in bespoke women’s clothing. Elegant, high-quality designs created with passion in the UK.';

function plainText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clip(text, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base}…`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const fallback = {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  };

  if (!id || typeof id !== 'string') return fallback;

  try {
    const doc = await db.collection('fabrics').doc(id).get();
    if (!doc.exists) return fallback;

    const data = doc.data() || {};
    const name =
      plainText(data.shortDescription) || plainText(data.name) || 'Fabric';
    const description =
      clip(plainText(data.description)) ||
      `${name} by Pink Skirt, a bespoke women’s clothing atelier in Cambridge.`;
    const title = `${name} – Pink Skirt`;
    const url = fabricUrl(
      data.name,
      data.shortDescription || data.description || data.name,
      data.id || id
    );
    const images = Array.isArray(data.imageUrls)
      ? data.imageUrls.filter(Boolean)
      : [];
    const image = images[0] || 'https://pinkskirt.uk/og-image.png';

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: 'Pink Skirt Atelier',
        images: [{ url: image, alt: name }],
        type: 'website',
        locale: 'en_GB',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return fallback;
  }
}

export default async function Page({ params }) {
  const { fabricCategory, fabricName, id } = await params;

  if (id && typeof id === 'string') {
    let canonicalCategory = '';
    let canonicalName = '';
    let canonicalId = id;
    try {
      const doc = await db.collection('fabrics').doc(id).get();
      if (doc.exists) {
        const data = doc.data() || {};
        canonicalCategory = String(data.name || '')
          .trim()
          .toLowerCase();
        canonicalName =
          slugify(data.shortDescription || data.description || data.name) || id;
        canonicalId = data.id || id;
      }
    } catch {
      canonicalCategory = '';
    }

    if (
      canonicalCategory &&
      (pathSlug(fabricCategory) !== canonicalCategory ||
        pathSlug(fabricName) !== canonicalName)
    ) {
      redirect(`/fabrics/${canonicalCategory}/${canonicalName}/${canonicalId}`);
    }
  }

  return <DetailFabricsPage />;
}
