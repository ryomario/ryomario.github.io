import { forwardRef } from "react";
import { SvgIconProps } from "../types";
import SvgIcon from "@mui/material/SvgIcon";

export const GithubIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
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
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor" 
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path fill="none" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </SvgIcon>
  );
});
