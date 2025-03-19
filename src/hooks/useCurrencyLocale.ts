import { useMemo } from 'react';

export function useCurrencyLocale(locale: string): string {
  return useMemo(() => {
    switch (locale) {
      case 'fr-FR':
        return '€';
      case 'en-US':
        return '$';
      case 'en-GB':
        return '£';
      case 'de':
        return '€';
      case 'jp':
        return '¥';
      default:
        return '₿'; 
    }
  }, [locale]);
}
