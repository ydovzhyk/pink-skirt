import { redirect } from 'next/navigation';
import DetailStoryPage from './detail-client';
import { db } from '@/utils/firebase/firebase-сonfig';
import { pathSlug, slugify, storyUrl } from '@/utils/seo/public-url';

const FALLBACK_TITLE = 'Pink Skirt – Bespoke Women’s Clothing by Inna Kuzmuk';
const FALLBACK_DESCRIPTION =
  'Pink Skirt – a unique atelier by Inna Kuzmuk, specializing in bespoke women’s clothing. Elegant, high-quality designs created with passion in the UK.';

function plainText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*/g, '')
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
    const doc = await db.collection('stories').doc(id).get();
    if (!doc.exists) return fallback;

    const data = doc.data() || {};
    const name = plainText(data.title) || 'Story';
    const description =
      clip(plainText(data.content)) ||
      `${name} by Pink Skirt, a bespoke women’s clothing atelier in Cambridge.`;
    const title = `${name} – Pink Skirt`;
    const url = storyUrl(data.title, data.id || id);
    const image = data.mainImageUrl || 'https://pinkskirt.uk/og-image.png';

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
        type: 'article',
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
  const { storyName, id } = await params;

  if (id && typeof id === 'string') {
    let canonicalSlug = '';
    let canonicalId = id;
    try {
      const doc = await db.collection('stories').doc(id).get();
      if (doc.exists) {
        const data = doc.data() || {};
        canonicalSlug = slugify(data.title) || id;
        canonicalId = data.id || id;
      }
    } catch {
      canonicalSlug = '';
    }

    if (canonicalSlug && pathSlug(storyName) !== canonicalSlug) {
      redirect(`/story/${canonicalSlug}/${canonicalId}`);
    }
  }

  return <DetailStoryPage />;
}
