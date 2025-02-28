import { profileData } from "@/data";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function ButtonDownloadCV() {
  const t = useTranslations('CV')

  return (
    <Link
      download={t('download_filename',{ name: profileData.name, ext: 'pdf' })}
      href={profileData.downloadCV}
      target="_blank"
      className="font-general-medium flex justify-center items-center w-36 sm:w-48 mt-12 mb-6 sm:mb-0 text-lg border border-indigo-200 dark:border-ternary-dark py-2.5 sm:py-3 shadow-lg rounded-lg bg-indigo-50 focus:ring-1 focus:ring-indigo-900 hover:bg-indigo-500 text-gray-700 hover:text-white duration-500"
      aria-label={t('download_btn')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 sm:mr-3 h-5 w-5 sn:w-6 sm:h-6 duration-100">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span className="text-sm sm:text-lg font-general-medium duration-100">
        {t('download_btn')}
      </span>
    </Link>
  )
}