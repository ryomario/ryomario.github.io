import { forwardRef } from "react";
import { SvgIconProps } from "../types";
import SvgIcon from "@mui/material/SvgIcon";

export const LinkedinIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
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
        { color: '#0a66c2' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor" 
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* letter i */}
      <rect fill="none" x="2" y="9" width="4" height="12"></rect>
      {/* dot of letter i */}
      <circle fill="none" cx="4" cy="4" r="2"></circle>

      {/* letter n */}
      <path fill="none" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    </SvgIcon>
  );
});
