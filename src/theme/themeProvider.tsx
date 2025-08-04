'use client';

import React from "react";
import { ThemeProviderProps as MuiThemeProviderProps, ThemeProvider as ThemeVarsProvider } from "@mui/material/styles"
import { useSettingsContext } from "@/settings/settingsProvider";
import { createTheme } from ".";
import CssBaseline from "@mui/material/CssBaseline";
import { IThemeOptions } from "@/types/ITheme";

type Props = Omit<MuiThemeProviderProps, 'theme'> & {
  theme?: IThemeOptions;
};

export function ThemeProvider({
  children,
  theme: propTheme,
  ...rest
}: Props) {
  const settings = useSettingsContext();

  const theme = createTheme({
    settingsState: settings.state,
    theme: propTheme,
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...rest}>
      <CssBaseline/>
      {children}
    </ThemeVarsProvider>
  )
}