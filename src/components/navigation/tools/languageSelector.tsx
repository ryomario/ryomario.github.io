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
    });
    setIsOpen(false);
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
              disabled={isPending}
            >
              {isPending ? <>
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                <span className="hidden xl:inline">{t('loading')}</span>
              </>: <>
                <FlagIcon countryCode={selectedLanguage.key}/>
                <span className="hidden xl:inline">{selectedLanguage.name}</span>
              </>}
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