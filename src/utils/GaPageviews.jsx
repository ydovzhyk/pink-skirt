'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GaPageviews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams?.toString();
    const url = pathname + (qs ? `?${qs}` : '');

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: window.location.origin + url,
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
