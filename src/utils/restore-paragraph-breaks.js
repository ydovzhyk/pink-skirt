export function restoreParagraphBreaks(text) {
  const source = String(text || '');
  let result = '';
  let inBold = false;
  let index = 0;

  while (index < source.length) {
    if (source.startsWith('**', index)) {
      inBold = !inBold;
      result += '**';
      index += 2;
      continue;
    }

    const char = source[index];
    const next = source[index + 1] || '';
    const afterBold = source.slice(index + 1, index + 4);
    const boldThenCapital = afterBold.startsWith('**') && /[A-Z]/.test(afterBold[2] || '');

    if (/[.!?]/.test(char) && boldThenCapital && inBold) {
      result += `${char}**\n\n`;
      inBold = false;
      index += 3;
      continue;
    }

    if (/[.!?]/.test(char) && boldThenCapital && !inBold) {
      result += `${char}\n\n`;
      index += 1;
      continue;
    }

    if (/[.!?]/.test(char) && /[A-Z]/.test(next)) {
      result += `${char}\n\n`;
      index += 1;
      continue;
    }

    result += char;
    index += 1;
  }

  return result;
}
