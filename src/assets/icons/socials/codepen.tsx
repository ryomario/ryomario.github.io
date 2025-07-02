import { forwardRef } from "react";
import { SvgIconProps } from "../types";
import SvgIcon from "@mui/material/SvgIcon";

export const CodepenIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  const {
    size = 24,
    sx,
    ...rest
  } = props;

  return (
    <SvgIcon
      ref={ref}
      {...rest}
      sx={[
        { width: size, height: 'auto', flexShrink: 0 },
        { color: 'text.primary' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      viewBox="20 0 26 26"
      strokeWidth={2.3}
      stroke="currentColor" 
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path fill="none" d="M22 16.7L33 24l11-7.3V9.3L33 2L22 9.3V16.7z M44 16.7L33 9.3l-11 7.4 M22 9.3l11 7.3 l11-7.3 M33 2v7.3 M33 16.7V24 "></path>
    </SvgIcon>
  );
});
