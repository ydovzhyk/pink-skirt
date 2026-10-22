import { redirect } from 'next/navigation';
import DetailFabricsPage from './detail-client';
import { db } from '@/utils/firebase/firebase-сonfig';
import { fabricUrl, pathSlug, slugify } from '@/utils/seo/public-url';

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id || typeof id !== 'string') return {};

  try {
    const doc = await db.collection('fabrics').doc(id).get();
    if (!doc.exists) return {};
    const data = doc.data() || {};
    const url = fabricUrl(
      data.name,
      data.shortDescription || data.description || data.name,
      data.id || id
    );
    return {
      alternates: { canonical: url },
      openGraph: { url },
    };
  } catch {
    return {};
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
