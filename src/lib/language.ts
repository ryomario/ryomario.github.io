import { Locale } from "@/i18n/routing";

/**
 * 
 * @param level id, 1 - 5
 * @param locale defaults to 'en'
 */
export function getLanguageLevel(level: number, locale: Locale = 'en'): string {
  level = Number(level);
  if(isNaN(level)) level = 1;

  switch(level) {
    case 1: return locale == 'id' ? 'Pemula' : 'Beginner';
    case 2: return locale == 'id' ? 'Menengah' : 'Intermediate';
    case 3: return locale == 'id' ? 'Fasih' : 'Fluent';
    case 4: return locale == 'id' ? 'Mahir' : 'Professional';
    case 5: return locale == 'id' ? 'Asli / Bilingual' : 'Native or Bilingual';
    default: return '';
  }
}

/**
 * 
 * @param locale defaults to 'en'
 * @returns 
 */
export function getAllLanguageLevels(locale: Locale = 'en'): { value: number, label: string }[] {
  return Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: getLanguageLevel(i + 1, locale),
  }));
}