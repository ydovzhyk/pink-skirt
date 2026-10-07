import { restoreParagraphBreaks } from '@/utils/restore-paragraph-breaks';

const linkClass =
  'underline underline-offset-2 hover:text-[var(--accent)] transition-colors duration-200';

export { restoreParagraphBreaks };

export function truncateFormatted(text, limit) {
  const source = restoreParagraphBreaks(text);
  let visible = 0;
  let result = '';
  let inBold = false;
  let index = 0;

  while (index < source.length && visible < limit) {
    if (source.startsWith('**', index)) {
      result += '**';
      inBold = !inBold;
      index += 2;
      continue;
    }
    result += source[index];
    visible += 1;
    index += 1;
  }

  if (inBold) result += '**';
  return result;
}

function renderInline(text, keyPrefix) {
  const parts = String(text || '').split(/(\*\*[\s\S]+?\*\*)/g);
  return parts.map((part, index) => {
    const isBold =
      part.startsWith('**') && part.endsWith('**') && part.length > 4;
    const value = isBold ? part.slice(2, -2) : part;
    const linked = linkifyStoryContent(value, `${keyPrefix}${index}-`);
    if (!isBold) return <span key={`${keyPrefix}${index}`}>{linked}</span>;
    return (
      <strong key={`${keyPrefix}${index}`} className="font-bold">
        {linked}
      </strong>
    );
  });
}

export function renderFormattedStory(text, suffix = '') {
  const paragraphs = restoreParagraphBreaks(text)
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return null;

  return paragraphs.map((paragraph, index) => {
    const isLast = index === paragraphs.length - 1;
    return (
      <span key={index} className="block mb-4 last:mb-0">
        {renderInline(paragraph, `${index}-`)}
        {isLast ? suffix : null}
      </span>
    );
  });
}

function linkifyStoryContent(text, keyPrefix = '') {
  const source = String(text || '');
  const pattern = /(?<![A-Za-z0-9._%+-])@[A-Za-z0-9._]+|https?:\/\/[^\s]+/g;
  const nodes = [];
  let lastIndex = 0;

  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(source.slice(lastIndex, index));

    const token = match[0];
    if (token.startsWith('@')) {
      const handle = token.replace(/^@/, '').replace(/\.+$/, '');
      const visible = `@${handle}`;
      const trailing = token.slice(visible.length);
      nodes.push(
        <a
          key={`${keyPrefix}${index}-ig`}
          href={`https://www.instagram.com/${handle}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {visible}
        </a>
      );
      if (trailing) nodes.push(trailing);
    } else {
      const url = token.replace(/[.,)]+$/, '');
      const trailing = token.slice(url.length);
      nodes.push(
        <a
          key={`${keyPrefix}${index}-url`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {url}
        </a>
      );
      if (trailing) nodes.push(trailing);
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < source.length) nodes.push(source.slice(lastIndex));
  return nodes;
}
