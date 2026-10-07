'use client';

import { useEffect, useRef, useState } from 'react';
import Text from '@/components/shared/text/text';
import { restoreParagraphBreaks as restoreSentenceSpaces } from '@/utils/restore-paragraph-breaks';

function isBoldElement(element) {
  const tag = element.tagName;
  const weight = element.style?.fontWeight || '';
  if (weight === 'normal' || weight === '400') return false;
  if (tag === 'B' || tag === 'STRONG') return true;
  if (weight === 'bold' || weight === 'bolder') return true;
  const numeric = Number.parseInt(weight, 10);
  return !Number.isNaN(numeric) && numeric >= 600;
}

function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const pieces = [];

  const push = (text, bold) => {
    if (!text) return;
    const last = pieces[pieces.length - 1];
    if (last && last.bold === bold) last.text += text;
    else pieces.push({ text, bold });
  };

  const walk = (node, bold) => {
    if (node.nodeType === Node.TEXT_NODE) {
      push(node.textContent.replace(/\u00a0/g, ' '), bold);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE') return;
    if (tag === 'BR') {
      push('\n', false);
      return;
    }
    const block = /^(P|DIV|LI|H[1-6]|TR|BLOCKQUOTE)$/.test(tag);
    if (block) {
      const last = pieces[pieces.length - 1];
      if (last && !last.text.endsWith('\n')) push('\n', false);
    }
    const nextBold = bold || isBoldElement(node);
    node.childNodes.forEach(child => walk(child, nextBold));
    if (block) push('\n', false);
  };

  walk(doc.body, false);

  return restoreSentenceSpaces(
    pieces
      .map(piece => {
        if (!piece.bold) return piece.text;
        const match = piece.text.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!match?.[2]) return piece.text;
        return `${match[1]}**${match[2]}**${match[3]}`;
      })
      .join('')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\n+|\n+$/g, '')
  );
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function markdownToHtml(markdown) {
  const escaped = escapeHtml(String(markdown || ''));
  return escaped
    .replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function domToMarkdown(root) {
  const lines = [];
  let current = '';

  const append = (node, bold) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/\u00a0/g, ' ');
      if (!bold || !text.trim()) {
        current += text;
        return;
      }
      const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
      current += `${match[1]}**${match[2]}**${match[3]}`;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName;
    if (tag === 'BR') {
      lines.push(current);
      current = '';
      return;
    }
    if (tag === 'DIV' || tag === 'P') {
      if (current) {
        lines.push(current);
        current = '';
      }
      node.childNodes.forEach(child => append(child, bold));
      lines.push(current);
      current = '';
      return;
    }
    const nextBold = bold || tag === 'STRONG' || tag === 'B';
    node.childNodes.forEach(child => append(child, nextBold));
  };

  root.childNodes.forEach(child => append(child, false));
  if (current) lines.push(current);
  return restoreSentenceSpaces(lines.join('\n').replace(/\n+$/g, ''));
}

function htmlHasBold(html) {
  return /<(b|strong)\b|font-weight\s*:\s*(bold|bolder|[6-9]00)/i.test(html);
}

const TextareaField = ({
  label,
  name,
  register,
  required,
  validation = {},
  maxLength,
  value = '',
  keepBold = false,
}) => {
  const ruleMax =
    typeof validation.maxLength === 'object'
      ? validation.maxLength.value
      : validation.maxLength;
  const finalMaxLength = maxLength ?? ruleMax ?? 1000;
  const [count, setCount] = useState(String(value || '').length);
  const hiddenRef = useRef(null);
  const editorRef = useRef(null);
  const lastEmitted = useRef(null);

  useEffect(() => {
    setCount(String(value || '').length);
  }, [value]);

  useEffect(() => {
    if (!keepBold || !editorRef.current) return;
    const next = restoreSentenceSpaces(String(value || ''));
    if (next === lastEmitted.current) return;
    editorRef.current.innerHTML = markdownToHtml(next);
    lastEmitted.current = next;
    if (next !== String(value || '') && hiddenRef.current) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      setter?.call(hiddenRef.current, next.slice(0, finalMaxLength));
      hiddenRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, [finalMaxLength, keepBold, value]);

  const writeValue = markdown => {
    const limited = String(markdown || '').slice(0, finalMaxLength);
    const field = hiddenRef.current;
    if (!field) return limited;

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    setter?.call(field, limited);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    lastEmitted.current = limited;
    setCount(limited.length);
    return limited;
  };

  const syncEditor = () => {
    if (!editorRef.current) return;
    const markdown = domToMarkdown(editorRef.current);
    const limited = writeValue(markdown);
    if (limited !== markdown) {
      editorRef.current.innerHTML = markdownToHtml(limited);
    }
  };

  const registration = register(name, {
    required,
    ...validation,
    onChange: event => setCount(event.target.value.length),
  });

  return (
    <div className="flex flex-col gap-2">
      <label>
        <Text
          type="tiny"
          as="p"
          fontWeight="light"
          className="text-[var(--text-title)]"
        >
          {label}
        </Text>
      </label>

      {keepBold ? (
        <>
          <textarea
            {...registration}
            ref={node => {
              registration.ref(node);
              hiddenRef.current = node;
            }}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            maxLength={finalMaxLength}
            required={required}
          />
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            aria-multiline="true"
            suppressContentEditableWarning
            className="bg-white w-full min-h-[120px] rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] px-3 py-2 text-[var(--text-title)] whitespace-pre-wrap [&_strong]:font-bold"
            onPaste={event => {
              const html = event.clipboardData?.getData('text/html') || '';
              if (!html || !htmlHasBold(html)) return;
              event.preventDefault();
              const markdown = htmlToMarkdown(html);
              const selection = window.getSelection();
              if (!selection || selection.rangeCount === 0) return;
              const range = selection.getRangeAt(0);
              range.deleteContents();
              const fragment = range.createContextualFragment(
                markdownToHtml(markdown)
              );
              range.insertNode(fragment);
              range.collapse(false);
              syncEditor();
            }}
            onInput={syncEditor}
          />
        </>
      ) : (
        <textarea
          {...registration}
          className="bg-white w-full rounded-md border-2 border-gray-300 outline-none focus:border-[var(--accent)] focus:ring-[var(--accent)] px-3 py-2 text-[var(--text-title)]"
          rows="4"
          maxLength={finalMaxLength}
          required={required}
        />
      )}

      <div className="text-xs text-right text-gray-500">
        {count}/{finalMaxLength} characters
      </div>
    </div>
  );
};

export default TextareaField;
