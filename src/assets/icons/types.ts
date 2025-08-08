import { SvgIconProps as MuiSvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

export type IconProps = {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export type SvgIconProps = MuiSvgIconProps & {
  size?: number | string;
}