'use client';

import { IThemeOptions } from '@/types/ITheme';
import { ColorSystem, createTheme as createMuiTheme, SupportedColorScheme } from '@mui/material/styles';
import { components } from './components';
import { ISettingsState } from '@/types/ISettings';

const baseTheme: IThemeOptions = {
  shape: { borderRadius: 8 },
  components,
  typography: {
    fontFamily: 'Roboto',
  },
}

function updateThemeWithSettings(themeOptions: IThemeOptions, settings?: ISettingsState) {
  const {
    colorScheme,
  } = settings ?? {};

  const lightPalette = themeOptions.colorSchemes?.light.palette as ColorSystem['palette'];

  const updateColorSheme = (scheme: SupportedColorScheme) => {
    const colorSchemes = themeOptions.colorSchemes?.[scheme];

    const updatedPalette = {
      ...colorSchemes?.palette,
      ...(scheme === 'light' && {
        background: {
          ...lightPalette?.background,
        }
      })
    }

    return {
      ...colorSchemes,
      palette: updatedPalette,
    }
  }

  return {
    ...themeOptions,
    colorSchemes: {
      light: updateColorSheme('light'),
      dark: updateColorSheme('dark'),
    }
  }
}

type CreateThemeProps = {
  settingsState?: ISettingsState;
}

export function createTheme({
  settingsState,
}: CreateThemeProps) {
  const updatedTheme = settingsState ? updateThemeWithSettings(baseTheme, settingsState) : baseTheme;

  const theme = createMuiTheme(updatedTheme);

  return theme;
}
