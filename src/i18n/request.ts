import {getRequestConfig} from 'next-intl/server';
import { Locale, routing } from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const messages = {
    ...(await import(`@/i18n/messages/${locale}.json`)).default,
    projects: (await import(`@/i18n/projects/${locale}.json`)).default
  }
 
  return {
    locale,
    messages
  };
});