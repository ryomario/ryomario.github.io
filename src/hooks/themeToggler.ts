'use client';

import { useSettingsContext } from "@/settings/settingsProvider";
import { useColorScheme } from "@mui/material/styles";
import { useCallback, useEffect, useMemo } from "react";

export function useThemeToggler() {
  const { state, setField } = useSettingsContext();
  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if(mode === 'system' && systemMode) {
      setField('colorScheme', systemMode);
    }
  }, [mode, systemMode]);

  const isDarkMode = useMemo(() => state.colorScheme === 'dark',[state.colorScheme]);

  return useCallback(() => {
    setMode(isDarkMode ? 'light' : 'dark');
    setField('colorScheme', isDarkMode ? 'light' : 'dark');
  },[isDarkMode]);
}