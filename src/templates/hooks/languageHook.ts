import { Locale, routing, usePathname, useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo, useTransition } from "react"

type UseLanguageReturn = {
  language: Locale;
  onChange: (newLang: Locale) => void;
  isLoading: boolean;
}

type Props = {
  defaultLang?: Locale;
}

export function useLanguage({ defaultLang = 'en' }: Props = {}): UseLanguageReturn {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useSearchParams();

  const language = useMemo<Locale>(() => routing.locales.find(l => l === locale) ?? defaultLang, [locale]);

  const handleChange = useCallback((nextLanguage: Locale) => {
    startTransition(() => {
      router.replace(
        `${pathname}?${params.toString()}`,
        { locale: nextLanguage }
      );
    });
  }, [language, pathname, params, router, startTransition]);

  return {
    language,
    onChange: handleChange,
    isLoading: isPending,
  }
}