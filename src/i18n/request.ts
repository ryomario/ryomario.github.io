import { getRequestConfig } from 'next-intl/server';
import { Locale, routing } from './routing';
import { getActiveTemplate } from '@/templates/registered';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // get active template
  const templateName = await getActiveTemplate();

  const messages = {
    ...(await import(`@/i18n/messages/${locale}.json`)).default,
    ...(await import(`@/i18n/messages/${templateName}/${locale}.json`)).default,
  }

  return {
    locale,
    messages
  };
});