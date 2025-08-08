import { IThemeOptions } from "@/types/ITheme";
import { Components, Theme } from "@mui/material/styles";

const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      boxShadow: `0 0 2px 0 rgba(9, 11, 17, ${0.05}), 0 12px 24px -4px rgba(9, 11, 17, ${0.05 * 0.6})`,
      ...theme.applyStyles('dark', {
        boxShadow: `0 0 2px 0 rgba(9, 11, 17, ${0.5}), 0 12px 24px -4px rgba(9, 11, 17, ${0.5 * 0.6})`,
      }),
      borderRadius: isNaN(Number(theme.shape.borderRadius)) ? theme.shape.borderRadius : `calc(2 * (${theme.shape.borderRadius}))`,
      zIndex: 0,
    })
  }
}

export const card: IThemeOptions['components'] = { MuiCard }