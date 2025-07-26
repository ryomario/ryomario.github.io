import { CSSProperties } from "react";

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
  spacing: (size: number|string) => string;
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    down: (size: TemplateThemeBreakpoints|number) => string;
    up: (size: TemplateThemeBreakpoints|number) => string;
    values: {
      mobile: number;
      tablet: number;
      desktop: number;
    }
  };
  createStyles: (mode: TemplateThemeMode|null, styles: CSSProperties) => CSSProperties;
  shadows: (size: number, mode?: TemplateThemeMode) => string | undefined;
}

export const defaultTemplateTheme: TemplateTheme = {
  colors: {
    primary: {
      main: '#0070f3',
      light: '#338CF5',
      dark: '#004EAA',
    },
    secondary: {
      main: '#7928ca',
      light: '#9353D4',
      dark: '#541C8D',
    },
    background: {
      default: {
        main: '#fafafa',
        light: '#fafafa',
        dark: '#232323',
      },
      paper: {
        main: '#ffffff',
        light: '#ffffff',
        dark: '#000000',
      },
    },
    text: {
      primary: {
        main: 'rgba(0,0,0,0.85)',
        light: 'rgba(0,0,0,0.85)',
        dark: 'rgba(255,255,255,0.85)',
      },
      secondary: {
        main: 'rgba(0,0,0,0.5)',
        light: 'rgba(0,0,0,0.5)',
        dark: 'rgba(255,255,255,0.5)',
      },
      disabled: {
        main: 'rgba(0,0,0,0.3)',
        light: 'rgba(0,0,0,0.3)',
        dark: 'rgba(255,255,255,0.3)',
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
    if(mode === 'dark') return {
      '.dark &': styles,
    } as CSSProperties;
      
    return styles;
  },
  shadows: (size, mode = 'light') => {
    if(!size) return undefined;
    const rgb = mode == 'light' ? '0,0,0' : '255,255,255';

    return `0 ${3 * size}px ${4 * size}px ${-0.5 * size}px rgba(${rgb}, 0.1), 0 ${size}px ${1.5 * size}px ${-1 * size}px rgba(${rgb}, 0.1)`;
  }
};

function breakpointMediaQuery(size: TemplateThemeBreakpoints|number, type: 'up'|'down'): string {
  let point = breakpointsValues.desktop;
  if(size === 'mobile') point = breakpointsValues.mobile;
  else if(size === 'tablet') point = breakpointsValues.tablet;
  else if(size === 'desktop') point = breakpointsValues.desktop;
  else point = size;

  return `@media (${type === 'up' ? 'min' : 'max'}-width: ${point}px)`;
}
