import { Locale } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"

type Props = {
  lang: Locale
  labelLang?: string
  isLoading?: boolean
  onChange?: (locale: Locale) => void
}

/**
 * Only handle two locales `en` and `id`
 * @returns 
 */
export function LanguageSwitcher({
  lang,
  labelLang,
  isLoading = false,
  onChange = () => {},
}: Props) {
  const t = useTranslations('LanguageSwitcher')
  const [currentLang, setCurrentLang] = useState<Locale>(lang)

  const toggleLanguange = useCallback(() => setCurrentLang((oldLang) => {
    const nextLang: Locale = oldLang != 'en' ? 'en' : 'id'

    onChange(nextLang)

    return nextLang
  }),[setCurrentLang, onChange])
  
  return (
    <button
      type="button"
      className={
        `relative inline-flex h-8 w-16 my-auto items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          'bg-gray-200 hover:bg-gray-300 focus:ring-indigo-500 text-gray-700'
        } ${
          'dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-indigo-400 dark:text-gray-300'
        } ${
          isLoading ? 'opacity-50 cursor-wait' : ''
        }`
      }
      onClick={toggleLanguange}
      aria-label={t('label', { current_lang: labelLang ?? currentLang })}
      disabled={isLoading}
    >
      <span
        className={`inline-flex size-6 transform items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm transition-transform duration-200 z-[1] ${
          currentLang === 'id' ? 'translate-x-8' : ''
        }`}
      >
        <span
          className={`fi fis ${
            currentLang === 'en' ? 'fi-gb' : 'fi-id'
          } rounded-full`}
        />
      </span>
      
      <span className="absolute left-1 flex justify-center items-center size-6 text-xs font-medium">EN</span>
      <span className="absolute right-1 flex justify-center items-center size-6 text-xs font-medium">ID</span>
    </button>
  )
}