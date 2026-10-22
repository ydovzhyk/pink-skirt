export const SITE_URL = 'https://pinkskirt.uk';

export function pathSlug(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch {
    return String(value || '');
  }
}

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function readyGoodUrl(title, id) {
  return `${SITE_URL}/ready-goods/${slugify(title) || id}/${id}`;
}

export function storyUrl(title, id) {
  return `${SITE_URL}/story/${slugify(title) || id}/${id}`;
}

export function fabricUrl(category, title, id) {
  const categorySlug = encodeURIComponent(
    String(category || '')
      .trim()
      .toLowerCase()
  );
  return `${SITE_URL}/fabrics/${categorySlug || id}/${slugify(title) || id}/${id}`;
}
