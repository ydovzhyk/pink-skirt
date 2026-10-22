import DetailFabricsPage from './detail-client';
import { db } from '@/utils/firebase/firebase-сonfig';
import { fabricUrl } from '@/utils/seo/public-url';

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

export default function Page() {
  return <DetailFabricsPage />;
}
