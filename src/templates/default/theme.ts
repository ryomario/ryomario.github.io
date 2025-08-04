import { rgb2hex } from "@/lib/colors";
import { IThemeOptions } from "@/types/ITheme";
import { ColorSystemOptions } from "@mui/material/styles";

const themeDark: ColorSystemOptions = {
  palette: {
    background: {
      default: rgb2hex([13, 36, 56]),
      paper: rgb2hex([30, 56, 81]),
    },
    primary: {
      main: rgb2hex([0, 112, 243]),
    },
    secondary: {
      main: rgb2hex([99, 102, 241]),
    },
  }
};
const themeLight: ColorSystemOptions = {
  palette: {
    background: {
      default: rgb2hex([255,255,255]),
      paper: rgb2hex([247, 248, 252]),
    }
  }
};

export const defaultTmplTheme: IThemeOptions = {
  colorSchemes: {
    dark: themeDark,
    light: themeLight,
  },
};