"use client"

import { useTranslations } from "next-intl"

export function AboutMe() {
  const t = useTranslations('AboutMe')

  return (
    <section className="py-14 lg:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
          <div className="img-box">
            <img
              src="/profile.png" alt="About me profile"
              className="max-lg:mx-auto rounded-full aspect-square object-cover bg-[radial-gradient(at_25%_25%,_var(--tw-gradient-stops))] from-secondary-light to-ternary-light dark:from-ternary-dark dark:to-primary-dark to-75% transition duration-300"
            />
          </div>
          <div className="lg:pl-[100px] flex items-center">
            <div className="data w-full text-ternary-dark dark:text-primary-light">
              <h2
                className="font-manrope font-bold text-4xl lg:text-5xl mb-9 max-lg:text-center relative"
              >
                {t('about_me')}
              </h2>
              <p className="font-normal text-xl leading-8 max-lg:text-center max-w-2xl mx-auto opacity-75">
                {t('text')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}