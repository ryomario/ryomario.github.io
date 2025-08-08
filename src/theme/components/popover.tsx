import { IThemeOptions } from "@/types/ITheme";
import { listClasses } from "@mui/material/List";
import { menuItemClasses } from "@mui/material/MenuItem";
import { alpha, Components, Theme } from "@mui/material/styles";

const MuiPopover: Components<Theme>['MuiPopover'] = {
  styleOverrides: {
    paper: ({ theme }) => {
      const borderRadiusInside = theme.shape.borderRadius;
      const borderRadius = (typeof theme.shape.borderRadius  === 'string') ? `calc(${theme.shape.borderRadius} * 1.25)` : `${theme.shape.borderRadius * 1.25}px`;

      return {
        backdropFilter: `blur(20px)`,
        WebkitBackdropFilter: `blur(20px)`,
        backgroundColor: alpha((theme.vars || theme).palette.background.paper, 0.9),
        padding: theme.spacing(0.5),
        borderRadius,
        [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
        [`& .${menuItemClasses.root}`]: { borderRadius: borderRadiusInside },
      }
    }
  }
}

export const popover: IThemeOptions['components'] = { MuiPopover }