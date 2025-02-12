'use client';

import { usePathname } from "@/i18n/routing";
import { useEffect } from "react";

export function ScrollTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0);
  },[pathname])
  return null
}