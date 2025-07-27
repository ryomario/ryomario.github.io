'use client';

export function useThemeToggler() {
  return () => {
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme-mode',isDark?'':'dark');
    document.documentElement.classList.toggle('dark');
  };
}