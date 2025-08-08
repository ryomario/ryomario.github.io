'use client';

import { useSettingsContext } from "@/settings/settingsProvider";

export function useThemeToggler() {
  const { state, setField } = useSettingsContext();
  return () => {
    const isDark = state.colorScheme == 'dark';
    localStorage.setItem('theme-mode',isDark?'':'dark');
    document.documentElement.classList.toggle('dark');
  };
}