const linkClass =
  'underline underline-offset-2 hover:text-[var(--accent)] transition-colors duration-200';

export function truncateFormatted(text, limit) {
  const source = String(text || '').replace(/([.!?])(?=[A-Z])/g, '$1 ');
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

function restoreSentenceSpaces(text) {
  return String(text || '').replace(/([.!?])(?=[A-Z])/g, '$1 ');
}

export function renderFormattedStory(text) {
  const parts = restoreSentenceSpaces(text).split(/(\*\*[\s\S]+?\*\*)/g);
  return parts.map((part, index) => {
    const isBold =
      part.startsWith('**') && part.endsWith('**') && part.length > 4;
    const value = isBold ? part.slice(2, -2) : part;
    const linked = linkifyStoryContent(value, `${index}-`);
    if (!isBold) return <span key={index}>{linked}</span>;
    return (
      <strong key={index} className="font-bold">
        {linked}
      </strong>
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
