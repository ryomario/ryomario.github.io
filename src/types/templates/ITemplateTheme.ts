import { adjustColorBrightness, rgb2hex } from "@/lib/colors";
import { CSSObject } from "@emotion/react";

type TemplateThemeMode = 'dark' | 'light';
type TemplateThemeBreakpoints = keyof typeof breakpointsValues;

interface TemplateThemeColor {
  main: string;
  light: string;
  dark: string;
}

const breakpointsValues = {
  mobile: 576,
  tablet: 768,
  desktop: 992,
}

export interface TemplateTheme {
  colors: {
    primary: TemplateThemeColor;
    secondary: TemplateThemeColor;
    background: {
      default: TemplateThemeColor;
      paper: TemplateThemeColor;
    };
    text: {
      primary: TemplateThemeColor;
      secondary: TemplateThemeColor;
      disabled: TemplateThemeColor;
    };
  };
  spacing: (size: number | string) => string;
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    down: (size: TemplateThemeBreakpoints | number) => string;
    up: (size: TemplateThemeBreakpoints | number) => string;
    values: {
      mobile: number;
      tablet: number;
      desktop: number;
    }
  };
  createStyles: (mode: TemplateThemeMode | null, styles: CSSObject) => CSSObject;
  shadows: (size: number, mode?: TemplateThemeMode) => string | undefined;
}

export const defaultTemplateTheme: TemplateTheme = {
  colors: {
    primary: {
      main: rgb2hex([0, 112, 243]),
      light: adjustColorBrightness(rgb2hex([0, 112, 243]), 20),
      dark: adjustColorBrightness(rgb2hex([0, 112, 243]), -20),
    },
    secondary: {
      main: rgb2hex([99, 102, 241]),
      light: adjustColorBrightness(rgb2hex([99, 102, 241]), 20),
      dark: adjustColorBrightness(rgb2hex([99, 102, 241]), -20),
    },
    background: {
      default: {
        main: '#ffffff',
        light: '#ffffff',
        dark: rgb2hex([13, 36, 56]),
      },
      paper: {
        main: rgb2hex([247, 248, 252]),
        light: rgb2hex([247, 248, 252]),
        dark: rgb2hex([30, 56, 81]),
      },
    },
    text: {
      primary: {
        main: rgb2hex([0,0,0], 0.9),
        light: rgb2hex([0,0,0], 0.9),
        dark: rgb2hex([255, 255, 255], 0.9),
      },
      secondary: {
        main: rgb2hex([0,0,0], 0.7),
        light: rgb2hex([0,0,0], 0.7),
        dark: rgb2hex([255, 255, 255], 0.7),
      },
      disabled: {
        main: rgb2hex([0,0,0], 0.3),
        light: rgb2hex([0,0,0], 0.3),
        dark: rgb2hex([255, 255, 255], 0.3),
      },
    },
  },
  spacing: (size) => typeof size === 'string' ? size : `${0.25 * size}rem`,
  breakpoints: {
    mobile: breakpointMediaQuery('mobile', 'down'),
    tablet: breakpointMediaQuery('tablet', 'up'),
    desktop: breakpointMediaQuery('desktop', 'up'),
    down: (size) => breakpointMediaQuery(size, 'down'),
    up: (size) => breakpointMediaQuery(size, 'up'),
    values: breakpointsValues,
  },
  createStyles: (mode, styles) => {
    if (mode === 'dark') return {
      ['.dark &']: styles,
    } as CSSObject;

    return styles;
  },
  shadows: (size, mode = 'light') => {
    if (!size) return undefined;
    const rgb = mode == 'light' ? '0,0,0' : '100,100,100';

    return `0 ${3 * size}px ${4 * size}px ${-0.5 * size}px rgba(${rgb}, 0.1), 0 ${size}px ${1.5 * size}px ${-1 * size}px rgba(${rgb}, 0.1)`;
  }
};

function breakpointMediaQuery(size: TemplateThemeBreakpoints | number, type: 'up' | 'down'): string {
  let point = breakpointsValues.desktop;
  if (size === 'mobile') point = breakpointsValues.mobile;
  else if (size === 'tablet') point = breakpointsValues.tablet;
  else if (size === 'desktop') point = breakpointsValues.desktop;
  else point = size;

  return `@media (${type === 'up' ? 'min' : 'max'}-width: ${point}px)`;
}
