'use client';

import { usePathname } from "@/i18n/routing"
import { useEffect, useState } from "react"

export function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false)

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		}
	})

	const onScroll = () => {
		if (!showScroll && window.scrollY > 400) {
			setShowScroll(true);
		} else if (showScroll && window.scrollY <= 400) {
			setShowScroll(false);
		}
	};

	const backToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

  return (
    <button
      type="button"
      className={`!fixed bottom-5 end-5 rounded-full p-3 text-xs font-medium uppercase leading-tight
        text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400
        shadow-md transition duration-150 ease-in-out
        bg-gray-100 dark:bg-secondary-dark hover:bg-gray-200 dark:hover:bg-ternary-dark
        hover:shadow-lg focus:bg-gray-200 dark:focus:bg-ternary-dark focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-gray-200 dark:active:bg-ternary-dark active:shadow-lg ${showScroll?'':'hidden'}`}
      onClick={backToTop}
      id="btn-back-to-top">
      <span className="[&>svg]:w-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
      </span>
    </button>
  )
}