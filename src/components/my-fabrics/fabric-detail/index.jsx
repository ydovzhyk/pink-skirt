'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Text from '../../shared/text/text';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { getAllFabrics } from '@/redux/fabrics/fabrics-selectors';
import { getScreenType } from '@/redux/technical/technical-selectors';
import { RxScissors } from 'react-icons/rx';
import SelectField from '@/components/shared/select-field/select-field';

const GARMENT_ICONS_BASE = '/images/garments';
const norm = s =>
  String(s || '')
    .trim()
    .toLowerCase();
const slugify = s =>
  String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-_\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Exchange rates (USD base from API)
const KEY1 = 'c387761eefc91005f40db998';
const KEY2 = 'ed07810753df7f892d787233';

const BASE = 'GBP';
const OPTIONS = ['GBP', 'EUR', 'USD', 'UAH', 'PLN'];
const SYMBOL = { GBP: '£', EUR: '€', USD: '$', UAH: '₴', PLN: 'zł' };

const FabricDetail = ({
  id,
  name,
  shortDescription,
  description,
  price,
  suggestedGarments = [],
  imageUrls = [],
}) => {
  const router = useRouter();
  const screenType = useSelector(getScreenType);
  const allFabrics = useSelector(getAllFabrics);

  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined')
      return localStorage.getItem('pinkskirt-currency') || BASE;
    return BASE;
  });
  const [ratesUSD, setRatesUSD] = useState(null);

  const images = useMemo(
    () => (Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : []),
    [imageUrls]
  );
  const [hoverMain, setHoverMain] = useState(false);
  const mainSrc = hoverMain && images[1] ? images[1] : images[0] || '';

  const categoryKey = norm(name);
  const categoryFabrics = useMemo(
    () => allFabrics.filter(f => norm(f?.name) === categoryKey),
    [allFabrics, categoryKey]
  );
  const activeInGroupIdx = categoryFabrics.findIndex(f => f.id === id);
  const hasPrevious = activeInGroupIdx > 0;
  const hasNext =
    activeInGroupIdx >= 0 && activeInGroupIdx < categoryFabrics.length - 1;

  const goToFabric = (cat, title, fabricId) => {
    router.push(`/fabrics/${slugify(cat)}/${slugify(title)}/${fabricId}`);
  };

  const handlePreviousItem = () => {
    if (!hasPrevious) return;
    const prev = categoryFabrics[activeInGroupIdx - 1];
    if (prev) goToFabric(prev.name, prev.shortDescription, prev.id);
  };

  const handleNextItem = () => {
    if (!hasNext) return;
    const next = categoryFabrics[activeInGroupIdx + 1];
    if (next) goToFabric(next.name, next.shortDescription, next.id);
  };

  useEffect(() => {
    let stopped = false;
    const fetchRates = async key => {
      const r = await fetch(
        `https://v6.exchangerate-api.com/v6/${key}/latest/USD`
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      const out = {};
      OPTIONS.forEach(code => {
        if (d.conversion_rates?.[code]) out[code] = d.conversion_rates[code];
      });
      return out;
    };
    (async () => {
      try {
        const r1 = await fetchRates(KEY1);
        if (!stopped) setRatesUSD(r1);
      } catch {
        try {
          const r2 = await fetchRates(KEY2);
          if (!stopped) setRatesUSD(r2);
        } catch (e) {
          console.error('Currency rates failed:', e);
        }
      }
    })();
    return () => {
      stopped = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem('pinkskirt-currency', currency);
  }, [currency]);

  const factor = useMemo(() => {
    if (currency === BASE) return 1;
    if (!ratesUSD || !ratesUSD[BASE] || !ratesUSD[currency]) return 1;
    return ratesUSD[currency] / ratesUSD[BASE];
  }, [ratesUSD, currency]);

  const formatPrice = useCallback(
    gbp => {
      const amountGbp = Number(gbp) || 0;
      if (!ratesUSD) {
        try {
          return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: BASE,
            maximumFractionDigits: 2,
          }).format(amountGbp);
        } catch {
          return `${SYMBOL[BASE] || ''}${amountGbp.toFixed(2)} ${BASE}`;
        }
      }
      const val = amountGbp * factor;
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency,
          maximumFractionDigits: 2,
        }).format(val);
      } catch {
        return `${SYMBOL[currency] || ''}${val.toFixed(2)} ${currency}`;
      }
    },
    [factor, currency, ratesUSD]
  );

  const currencyOptions = useMemo(
    () =>
      OPTIONS.map(c => ({
        value: c,
        label: (
          <Text type="extraSmall" as="span" className="text-[#444444]">
            {c} {SYMBOL[c] || ''}
          </Text>
        ),
      })),
    []
  );
  const currencyValue =
    currencyOptions.find(o => o.value === currency) || currencyOptions[0];
  const onCurrencyChange = opt => setCurrency(opt?.value || BASE);

  return (
    <section
      id="fabric-detail"
      className="relative container pt-[65px] pb-10 lg:pt-[75px] lg:pb-12 flex flex-col gap-10 lg:gap-12"
    >
      <button
        onClick={() => router.back()}
        className="absolute top-5 left-0 flex items-center gap-2 px-3 py-2 text-[var(--text-title)] hover:text-[var(--accent)] transition-colors duration-300"
      >
        <RiArrowGoBackFill className="w-5 h-5" />
        <Text
          type="small"
          as="p"
          fontWeight="light"
          className="text-[var(--text-title)]"
        >
          Go back
        </Text>
      </button>

      {screenType === 'isMobile' && (
        <div className="text-center">
          <Text
            type="normal"
            as="h2"
            fontWeight="medium"
            className="text-black"
          >
            {shortDescription}
          </Text>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <div className="w-full">
          <div
            className="relative w-full aspect-[27/40] overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg"
            onMouseEnter={() => setHoverMain(true)}
            onMouseLeave={() => setHoverMain(false)}
          >
            {mainSrc ? (
              <img
                src={mainSrc}
                alt={shortDescription || 'fabric'}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {screenType !== 'isMobile' && (
            <Text
              type="normal"
              as="h2"
              fontWeight="medium"
              className="text-black"
            >
              {shortDescription}
            </Text>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <RxScissors size={22} />
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[#444444]"
              >
                {formatPrice(price)} / half-metre
              </Text>
            </div>
            <div>
              <SelectField
                name="currency"
                value={currencyValue}
                handleChange={onCurrencyChange}
                placeholder="Currency"
                required={true}
                options={currencyOptions}
                width={screenType !== 'isDesktop' ? 100 : 100}
                topPlaceholder={false}
                textColor="#444444"
                textAlign="left"
              />
            </div>
          </div>

          {categoryFabrics.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryFabrics.map(f => {
                const thumb = (f.imageUrls || []).filter(Boolean)[0];
                const isActive = f.id === id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => goToFabric(f.name, f.shortDescription, f.id)}
                    className={`w-full flex flex-col text-left rounded-md overflow-hidden border bg-white transition-all duration-200 shadow-lg ${
                      isActive
                        ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                        : 'border-gray-300 hover:border-[var(--accent)]'
                    }`}
                    aria-label={f.shortDescription}
                    title={f.shortDescription}
                  >
                    <div className="w-full h-full">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={f.shortDescription || 'fabric option'}
                          className="w-full aspect-[3/4] object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="px-2 py-2 w-full h-[40px] flex flex-row items-center justify-center">
                      <Text
                        type="small"
                        as="p"
                        fontWeight="light"
                        className="text-[var(--text-title)] line-clamp-2"
                      >
                        {f.color || f.name}
                      </Text>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="w-full flex flex-col items-start gap-4">
            <Text
              type="tiny"
              as="p"
              fontWeight="normal"
              lineHeight="normal"
              className="text-black text-left"
            >
              Description:
            </Text>
            {description && (
              <Text
                type={
                  screenType === 'isDesktop'
                    ? 'tiny'
                    : screenType === 'isTablet'
                      ? 'small'
                      : screenType === 'isMobile'
                        ? 'tiny'
                        : 'tiny'
                }
                as="p"
                fontWeight="light"
                lineHeight="snug"
                className="text-[var(--text-title)] whitespace-pre-line"
              >
                {description || 'No description available.'}
              </Text>
            )}
          </div>

          {Array.isArray(suggestedGarments) && suggestedGarments.length > 0 && (
            <div className="mt-2">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className="text-[var(--text-title)] mb-2"
              >
                SUGGESTED GARMENTS:
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                {suggestedGarments.map(key => (
                  <div
                    key={key}
                    className="w-14 h-14 flex items-center justify-center rounded-md border border-gray-300 bg-white"
                    title={key}
                  >
                    <img
                      src={`${GARMENT_ICONS_BASE}/${key}.png`}
                      alt={key}
                      className="max-w-[35px] max-h-[35px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousItem}
          disabled={!hasPrevious}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasPrevious
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Previous item
          </Text>
        </button>

        <button
          onClick={handleNextItem}
          disabled={!hasNext}
          className={`text-black border-b w-fit transition-colors duration-200 ${
            hasNext
              ? 'border-gray-400 hover:border-[var(--accent)]'
              : 'border-gray-300 opacity-50 cursor-not-allowed'
          }`}
        >
          <Text
            type="extra-small"
            as="p"
            fontWeight="light"
            className="text-black"
          >
            Next item
          </Text>
        </button>
      </div>
    </section>
  );
};

export default FabricDetail;
