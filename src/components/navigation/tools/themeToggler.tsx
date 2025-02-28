"use client"

export function ThemeToggler() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme-mode',isDark?'':'dark')
    document.documentElement.classList.toggle('dark')
  }
  return (
    <button onClick={toggleTheme} className="bg-primary-light dark:bg-ternary-dark p-3 shadow-sm rounded-xl cursor-pointer">
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block text-ternary-light hover:text-primary-light text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="block dark:hidden text-ternary-dark hover:text-primary-dark text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </button>
  )
}