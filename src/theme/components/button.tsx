import { ButtonProps } from "@mui/material/Button";
import type { Components, CSSObject, Theme } from "@mui/material/styles";
import { hex2rgb } from "@/lib/colors";
import { Logger } from "@/utils/logger";

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

type PaletteColor = (typeof COLORS)[number];

function styleColors(ownerState: ButtonProps, styles: (val: PaletteColor) => CSSObject) {
  const outputStyle = COLORS.reduce((acc, color) => {
    if(!ownerState.disabled && ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

function createShadowColor(color: string, alpha = 0.24) {
  try {
    const rgb = hex2rgb(color);
    color = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  } catch(error) {
    Logger.debug(error, 'createShadowColor');
  }
  return `0 8px 16px 0 ${color ?? `rgba(0,0,0,${alpha})`}`
}

const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: { color: 'inherit', disableElevation: true },
  styleOverrides: {
    contained: ({ theme, ownerState }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          '&:hover': { boxShadow: createShadowColor(theme.palette[color].main) },
        })),
        inheritColor: {
          ...(ownerState.color === 'inherit' && !ownerState.disabled && {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey[800],
            '&:hover': {
              boxShadow: createShadowColor(theme.palette.common.black, 0.16),
              backgroundColor: theme.palette.grey[700],
            },
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[800],
              backgroundColor: theme.palette.common.white,
              '&:hover': {
                boxShadow: createShadowColor(theme.palette.grey[500], 0.16),
                backgroundColor: theme.palette.grey[400],
              },
            }),
          })
        },
      }
      return { ...styled.inheritColor, ...styled.colors };
    },
    text: ({ theme, ownerState }) => {
      const styled = {
        inheritColor: {
          ...(ownerState.color === 'inherit' && !ownerState.disabled && {
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          })
        },
      }
      return { ...styled.inheritColor };
    },

    /**
     * @size
     */
    sizeSmall: ({ ownerState }) => ({
      height: 30,
      ...(ownerState.variant === 'text'
        ? { paddingLeft: '4px', paddingRight: '4px' }
        : { paddingLeft: '8px', paddingRight: '8px' }),
    }),
    sizeMedium: ({ ownerState }) => ({
      ...(ownerState.variant === 'text'
        ? { paddingLeft: '8px', paddingRight: '8px' }
        : { paddingLeft: '16px', paddingRight: '16px' }),
    }),
    sizeLarge: ({ ownerState }) => ({
      height: 48,
      ...(ownerState.variant === 'text'
        ? { paddingLeft: '10px', paddingRight: '10px' }
        : { paddingLeft: '16px', paddingRight: '16px' }),
    }),
  }
}

export const button = {
  MuiButton,
}