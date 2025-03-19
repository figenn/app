import { useLocale } from "next-intl";
import { fr, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

export function useDateLocale(): Locale {
  const locale = useLocale();
  
  switch (locale) {
    case "fr":
      return fr;
    case "en":
      return enUS;
    default:
      return enUS;
  }
}