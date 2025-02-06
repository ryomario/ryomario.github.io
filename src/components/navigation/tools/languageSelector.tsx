"use client"

import { useEffect, useState, useTransition } from "react";
import styles from "./languageSelector.module.css"
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface FlagIconProps {
  countryCode: string;
}

function FlagIcon({countryCode = ""}: FlagIconProps) {

  if (countryCode === "en") {
      countryCode = "gb";
  }

  return (
      <span
          className={`fi fis ${styles.fiCircle} inline-block mr-2 fi-${countryCode}`}
      />
  );
}

interface Language {
  key: Locale;
  name: string;
}


const LANGUAGE_SELECTOR_ID = 'language-selector';

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  const t = useTranslations('LanguageSelector')

  const languages: Language[] = routing.locales.map(key => ({ key, name: t(`languages.${key}`) }))
  
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = languages.find(language => language.key == locale);
  
  function handleLanguageChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
      setIsOpen(false);
    });
  }
  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest('button');
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return;
      }
      setIsOpen(false);
    }
    window.addEventListener('click', handleWindowClick)
    return () => {
      window.removeEventListener('click', handleWindowClick);
    }
  }, []);
  
  if (!selectedLanguage) {
    return null;
  }
  
  return (
    <>
      <div className="flex items-center z-40">
        <div className="relative inline-block text-left">
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-primary-light dark:bg-ternary-dark dark:border-gray-600 text-sm font-medium text-ternary-dark dark:text-ternary-light focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
              id={LANGUAGE_SELECTOR_ID}
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <FlagIcon countryCode={selectedLanguage.key}/>
              <span className="hidden xl:inline">{selectedLanguage.name}</span>
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {isOpen && <div
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-primary-light dark:bg-ternary-dark ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-selector"
          >
            <div className="py-1 flex flex-col gap-2" role="none">
              {languages.map((language, index) => {
                return (
                  <button
                    key={language.key}
                    onClick={() => handleLanguageChange(language.key)}
                    className={`${
                        selectedLanguage.key === language.key
                            ? "bg-gray-100 dark:bg-gray-800"
                            : ""
                    } text-ternary-dark dark:text-ternary-light block px-4 py-2 text-sm text-left items-center inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'rounded-r' : 'rounded-l'}`}
                    role="menuitem"
                  >
                    <FlagIcon countryCode={language.key}/>
                    <span className="truncate">{language.name}</span>
                  </button>
                );
              })}
            </div>
          </div>}
        </div>
      </div>
    </>
  )
}