'use client';

import { useEffect, useMemo, useState } from 'react';
import translate from 'translate';
import languagesAndCodes from './languagesAndCodes';
import SelectField from '@/components/shared/select-field/select-field';
import { useLanguage } from './language-context';

translate.key = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY || '';

export default function TranslateMe({ textColor = 'black' }) {
  const { updateLanguageIndex } = useLanguage();
  const [languageIndex, setLanguageIndex] = useState(0);

  useEffect(() => {
    const savedRaw = localStorage.getItem('mental-health.languageIndex');
    const saved = Number(savedRaw);

    if (!Number.isNaN(saved) && saved >= 0) {
      setLanguageIndex(saved);
      updateLanguageIndex(saved);
    } else {
      setLanguageIndex(0);
      updateLanguageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => {
    return languagesAndCodes.languages.map((l, index) => ({
      value: index.toString(),
      label: l.lang,
      code: l.code,
      lang: l.lang,
    }));
  }, []);

  const handleChange = selectedOption => {
    const selectedIndex = Number(selectedOption.value);
    setLanguageIndex(selectedIndex);
    updateLanguageIndex(selectedIndex);
    localStorage.setItem(
      'mental-health.languageIndex',
      selectedIndex.toString()
    );
  };

  return (
    <SelectField
      name="language"
      value={options[languageIndex]}
      handleChange={handleChange}
      placeholder="Language"
      required={true}
      options={options}
      topPlaceholder={false}
      textColor={textColor}
      isSearchable={false}
      containerClassName="w-[80px] md:w-[125px]"
      variant="language"
    />
  );
}

export async function translateMyText(text = '', languageIndex) {
  const { languages } = languagesAndCodes;
  const lang = languages[languageIndex];

  if (lang) {
    const result = await translate(text, lang.code);
    return result;
  } else {
    throw new Error('Language not found');
  }
}

export const useTranslate = text => {
  const [translatedText, setTranslatedText] = useState(text);
  const { languageIndex } = useLanguage();

  const normalizeCase = text => {
    if (typeof text === 'string') {
      return text.replace(
        /(^|\.\s+)([a-z])/g,
        (_, prefix, letter) => prefix + letter.toUpperCase()
      );
    }

    if (Array.isArray(text)) {
      return text
        .join('')
        .replace(
          /(^|\.\s+)([a-z])/g,
          (_, prefix, letter) => prefix + letter.toUpperCase()
        );
    }

    return '';
  };

  useEffect(() => {
    translateMyText(text, languageIndex)
      .then(res => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(res)) {
          setTranslatedText(res);
        } else {
          setTranslatedText(normalizeCase(res));
        }
      })
      .catch(err => console.error(err));
  }, [text, languageIndex]);

  return translatedText;
};

export const TranslatedText = ({ text }) => {
  const translatedText = useTranslate(text);
  return <>{translatedText}</>;
};
