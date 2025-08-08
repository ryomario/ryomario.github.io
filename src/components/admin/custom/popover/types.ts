import { PaperProps } from "@mui/material/Paper";
import { PopoverOrigin, PopoverProps } from "@mui/material/Popover";
import { CSSObject, SxProps, Theme } from "@mui/material/styles";

export type PopoverArrowProps = {
  hide?: boolean;
  size?: number;
  offset?: number;
  sx?: SxProps<Theme>;
  placement?: 
    |'top-left'|'top-center'|'top-right'
    |'bottom-left'|'bottom-center'|'bottom-right'
    |'left-top'|'left-center'|'left-bottom'
    |'right-top'|'right-center'|'right-bottom'
}

export type CustomPopoverProps = PopoverProps & {
  slotProps: PopoverProps['slotProps'] & {
    arrow?: PopoverArrowProps;
    paper?: PaperProps;
  }
}

export type AnchorOriginProps = {
  paperStyles?: CSSObject;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
}