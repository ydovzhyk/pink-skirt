import DetailReadyGoodsPage from './detail-client';
import { db } from '@/utils/firebase/firebase-сonfig';

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
  const { goodsName, id } = await params;
  const fallback = {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  };

  if (!id || typeof id !== 'string') return fallback;

  try {
    const doc = await db.collection('ready-goods').doc(id).get();
    if (!doc.exists) return fallback;

    const data = doc.data() || {};
    const name = plainText(data.title) || 'Ready-made piece';
    const description =
      clip(plainText(data.shortDescription) || plainText(data.description)) ||
      `${name} by Pink Skirt, a bespoke women’s clothing atelier in Cambridge.`;
    const title = `${name} – Pink Skirt`;
    const url = `https://pinkskirt.uk/ready-goods/${goodsName}/${id}`;
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

export default function Page() {
  return <DetailReadyGoodsPage />;
}
