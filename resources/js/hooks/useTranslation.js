import { usePage } from '@inertiajs/react';

export function useTranslation() {
  const { props } = usePage();
  const translations = props?.translations || {};
  const locale = props?.locale || 'en';
  const direction = props?.direction || (locale === 'ar' ? 'rtl' : 'ltr');
  const locales = props?.locales || [];

  const __ = (key, replace = {}) => {
    if (!key) return '';
    let text = translations[key] !== undefined ? translations[key] : key;
    if (typeof text === 'string' && replace && Object.keys(replace).length > 0) {
      Object.keys(replace).forEach((rKey) => {
        text = text.replace(`:${rKey}`, replace[rKey]);
      });
    }
    return text;
  };

  return {
    __,
    locale,
    direction,
    isRtl: direction === 'rtl',
    locales,
  };
}

export default useTranslation;
