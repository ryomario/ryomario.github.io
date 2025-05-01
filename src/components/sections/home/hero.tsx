"use client"

import { ButtonDownloadCV } from "@/components/reusable/buttonDownloadCV";
import { useProfileData } from "@/contexts/profileDataContext";
import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations('HeroSection');
  const { name } = useProfileData()

  return (
    <>
      <div
        className="w-full flex flex-col sm:justify-between items-center sm:flex-row mt-12 md:mt-2"
      >
        <div className="w-full md:w-1/3 text-left">
          <h1 className="font-general-semibold text-2xl lg:text-3xl xl:text-4xl text-center sm:text-left text-ternary-dark dark:text-primary-light uppercase">
            {t('heading_1',{ name })}
          </h1>
          <p className="font-general-medium mt-4 text-lg md:text-xl lg:text-2xl xl:text-3xl text-center sm:text-left leading-normal text-gray-500 dark:text-gray-200">
            {t('heading_2')}
          </p>

          <div className="flex justify-center sm:block">
            <ButtonDownloadCV/>
          </div>
        </div>
        <div className="w-full sm:w-2/3 text-right float-right mt-8 sm:mt-0">
          <img
            src="/illustration.svg"
            alt={t('hero_img_alt')}
            className="w-full object-cover"
          />
        </div>
      </div>
    </>
  )
}