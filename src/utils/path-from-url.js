export function gcsPathFromUrl(url, expectedBucket) {
  try {
    const u = new URL(url);

    if (u.hostname === 'storage.googleapis.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const bucket = parts[0];
        const objectPath = parts.slice(1).join('/');
        if (!expectedBucket || bucket === expectedBucket) {
          return decodeURIComponent(objectPath);
        }
      }
    }
  } catch (err) {
    console.error('URL parse error:', err);
  }
  return null;
}
