import { ColorSystemOptions, CssVarsThemeOptions, Shadows, SupportedColorScheme, ThemeOptions } from "@mui/material/styles";

type ColorSchemeOptionsExtended = ColorSystemOptions & {
  shadows?: Shadows;
}

export type IThemeOptions = Omit<ThemeOptions, "components"> & Pick<CssVarsThemeOptions, "defaultColorScheme" | "components"> & {
  colorSchemes?: Record<SupportedColorScheme, ColorSchemeOptionsExtended>;
  cssVariables?: boolean | Pick<CssVarsThemeOptions, "colorSchemeSelector" | "rootSelector" | "disableCssColorScheme" | "cssVarPrefix" | "shouldSkipGeneratingVar">;
}