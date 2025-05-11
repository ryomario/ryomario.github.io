"use client"

import { useCallback, useTransition } from "react";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/reusable/languageSwitcher";

interface Language {
  key: Locale;
  name: string;
}

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  const t = useTranslations('LanguageSelector')

  const languages: Language[] = routing.locales.map(key => ({ key, name: t(`languages.${key}`) }))
  
  const selectedLanguage = languages.find(language => language.key == locale);
  
  const handleChange = useCallback((nextLocale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  },[selectedLanguage, pathname, params, router, startTransition])
  
  if (!selectedLanguage) {
    return null;
  }

  return <LanguageSwitcher
    lang={selectedLanguage.key}
    labelLang={selectedLanguage.name}
    isLoading={isPending}
    onChange={handleChange}
  />
}