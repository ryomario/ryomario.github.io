import { Locale } from "@/i18n/routing"
import { useCallback, useMemo, useState } from "react"

type Props = {
  lang?: Locale
  defaultLang?: Locale
  disabled?: boolean
  onChange?: (locale: Locale) => void
}

/**
 * Only handle two locales `en` and `id`
 * @returns 
 */
export function LanguageSwitcherRadioInput({
  lang: propLang,
  defaultLang = 'en',
  disabled = false,
  onChange,
}: Props) {
  const [currentLang, setCurrentLang] = useState<Locale>(defaultLang)

  // Determine if component is controlled
  const isControlled = typeof propLang !== 'undefined'
  const lang = useMemo(() => isControlled ? propLang : currentLang,[currentLang, propLang, isControlled])

  const changeLanguange = useCallback((locale?: Locale) => {
    const nextLang: Locale = locale ? locale : (lang != 'en' ? 'en' : 'id')

    if(onChange) {
      onChange(nextLang)
    }

    if(!isControlled) {
      setCurrentLang(nextLang)
    }
  },[setCurrentLang, onChange, lang])
  
  return (
    <ul className="grid w-full gap-6 md:grid-cols-2">
      <li>
        <input type="radio" id="en" name="hosting" value="en" className="hidden peer" onChange={e => e.target.checked && changeLanguange('en')} checked={lang == 'en'} required />
        <label htmlFor="en" className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
          <span className="fi fis fi-gb rounded-full text-2xl"/>
          <span className="ml-5 text-lg font-semibold">English</span>
        </label>
      </li>
      <li>
        <input type="radio" id="id" name="hosting" value="id" className="hidden peer" onChange={e => e.target.checked && changeLanguange('id')} checked={lang == 'id'} />
        <label htmlFor="id" className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
          <span className="fi fis fi-id rounded-full text-2xl"/>
          <span className="ml-5 text-lg font-semibold">Indonesia</span>
        </label>
      </li>
    </ul>
  )
    {/* <button
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
    </button> */}
}