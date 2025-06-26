'use client';

import React from "react";
import { ThemeProviderProps as MuiThemeProviderProps, ThemeProvider as ThemeVarsProvider } from "@mui/material/styles"
import { useSettingsContext } from "@/settings/settingsProvider";
import { createTheme } from ".";
import CssBaseline from "@mui/material/CssBaseline";

type Props = Omit<MuiThemeProviderProps, 'theme'>;

export function ThemeProvider({
  children,
  ...rest
}: Props) {
  const settings = useSettingsContext();

  const theme = createTheme({
    settingsState: settings.state,
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...rest}>
      <CssBaseline/>
      {children}
    </ThemeVarsProvider>
  )
}