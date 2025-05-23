"use client"

import Image from "next/image"
import { ThemeToggler } from "./tools/themeToggler"
import { LanguageSelector } from "./tools/languageSelector"
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "../reusable/button";
import { useProfileData } from "@/contexts/profileDataContext";

export function Navbar() {
	const [showMenu, setShowMenu] = useState(false);
  const t = useTranslations('Navbar');
  const profileData = useProfileData()
  
	function toggleMenu() {
		if (!showMenu) {
			setShowMenu(true);
		} else {
			setShowMenu(false);
		}
	}
  
  return (
    <nav className="sm:container sm:mx-auto">
      <div className="z-10 mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Ryomario</span>
            <img
              className="dark:invert transition duration-300 max-[360px]:hidden"
              src="/icon.svg"
              alt="Ryomario logo"
              height={35}
              width={35}
            />
          </Link>
        </div>

        <div className="flex lg:hidden gap-3">
          <LanguageSelector/>
          <ThemeToggler/>
          <button type="button" onClick={toggleMenu} className="-m-2.5 ml-5 inline-flex items-center justify-center rounded-md p-2.5 text-ternary-dark dark:text-ternary-light">
            {
              showMenu ? <>
                <span className="sr-only">{t('srOnly.closeMenu')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </> : <>
                <span className="sr-only">{t('srOnly.openMenu')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </>
            }
          </button>
        </div>

        <div className="font-general-medium hidden m-0 sm:ml-4 mt-5 sm:mt-3 lg:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none">
          <Link
            href="/projects"
            className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
            aria-label={t('menus.projects')}
          >
            {t('menus.projects')}
          </Link>
          <Link
            href="/about"
            className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
            aria-label={t('menus.aboutme')}
          >
            {t('menus.aboutme')}
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
          <div className="hidden md:flex">
            {profileData.hireable && <button className="text-md font-general-medium bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm rounded-md px-5 py-2.5 duration-300" aria-label={t('buttons.hireme')}>
              {t('buttons.hireme')}
            </button>}
          </div>
          <LanguageSelector/>
          <ThemeToggler/>
        </div>
      </div>
      <div
        className={`${
          showMenu
            ? 'block m-0 sm:ml-4 mt-3 sm:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none'
            : 'hidden'
        } lg:hidden`}
      >
        <Link
          href="/projects"
          className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
          aria-label={t('menus.projects')}
        >
          {t('menus.projects')}
        </Link>
        <Link
          href="/about"
          className="block text-left text-lg text-primary-dark dark:text-ternary-light hover:text-secondary-dark dark:hover:text-secondary-light  sm:mx-4 mb-2 sm:py-2"
          aria-label={t('menus.aboutme')}
        >
          {t('menus.aboutme')}
        </Link>
        {profileData.hireable && <Button
          text={t('buttons.hireme')}
          label={t('buttons.hireme')}
        />}
      </div>
    </nav>
  )
}