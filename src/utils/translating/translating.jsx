'use client'

import { useEffect, useState } from 'react'
import translate from 'translate'
import languagesAndCodes from './languagesAndCodes'
import SelectField from '@/components/shared/select-field/select-field'
import { useLanguage } from './language-context'

translate.key = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY || ''

export default function TranslateMe({ textColor = 'black' }) {
  const { updateLanguageIndex } = useLanguage();
  const [languageIndex, setLanguageIndex] = useState(0);

  useEffect(() => {
    const savedIndex = localStorage.getItem('mental-health.languageIndex');
    if (Number(savedIndex) !== Number(languageIndex)) {
      setLanguageIndex(Number(savedIndex));
      updateLanguageIndex(Number(savedIndex));
    }
  }, [languageIndex, updateLanguageIndex]);

  const options = languagesAndCodes.languages.map((language, index) => ({
    value: index.toString(),
    label: language.lang,
  }));

  const handleChange = async selectedOption => {
    const selectedIndex = Number(selectedOption.value);
    setLanguageIndex(selectedIndex);
    updateLanguageIndex(selectedIndex);
    localStorage.setItem(
      'mental-health.languageIndex',
      selectedIndex.toString()
    );
  };

  return (
    <div>
      <SelectField
        name="language"
        value={options[languageIndex]}
        handleChange={handleChange}
        placeholder="Language"
        required={true}
        options={options}
        width="125px"
        topPlaceholder={false}
        textColor={textColor}
      />
    </div>
  );
}

export async function translateMyText(text = '', languageIndex) {
  const { languages } = languagesAndCodes
  const lang = languages[languageIndex]

  if (lang) {
    const result = await translate(text, lang.code)
    return result
  } else {
    throw new Error('Language not found')
  }
}

export const useTranslate = text => {
  const [translatedText, setTranslatedText] = useState(text)
  const { languageIndex } = useLanguage()

  const normalizeCase = text => {
    if (typeof text === 'string') {
      return text.replace(
        /(^|\.\s+)([a-z])/g,
        (_, prefix, letter) => prefix + letter.toUpperCase()
      )
    }

    if (Array.isArray(text)) {
      return text
        .join('')
        .replace(
          /(^|\.\s+)([a-z])/g,
          (_, prefix, letter) => prefix + letter.toUpperCase()
        )
    }

    return ''
  }

  useEffect(() => {
    translateMyText(text, languageIndex)
      .then(res => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (emailRegex.test(res)) {
          setTranslatedText(res)
        } else {
          setTranslatedText(normalizeCase(res))
        }
      })
      .catch(err => console.error(err))
  }, [text, languageIndex])

  return translatedText
}

export const TranslatedText = ({ text }) => {
  const translatedText = useTranslate(text)
  return <>{translatedText}</>
}
