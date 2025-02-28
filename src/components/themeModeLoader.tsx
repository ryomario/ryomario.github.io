'use client';

import { useEffect } from "react";

export function ThemeModeLoader() {
  useEffect(() => {
    if(localStorage.getItem('theme-mode') == 'dark'){
      document.documentElement.classList.add('dark');
    }
  },[])
  return null
}