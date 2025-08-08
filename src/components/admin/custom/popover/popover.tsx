import Popover from "@mui/material/Popover";
import { CustomPopoverProps } from "./types";
import { calculateAchorOrigin } from "./utils";
import { listClasses } from "@mui/material/List";
import { menuItemClasses } from "@mui/material/MenuItem";
import { Arrow } from "./styles";


export function CustomPopover({
  open,
  onClose,
  children,
  anchorEl,
  slotProps,
  ...rest
}: CustomPopoverProps) {
  const { arrow: arrowProps, paper: paperProps, ...restSlotProps } = slotProps ?? {};

  const arrowSize = arrowProps?.size ?? 14;
  const arrowOffset = arrowProps?.offset ?? 17;
  const arrowPlacement = arrowProps?.placement ?? 'top-right';

  const { paperStyles, anchorOrigin, transformOrigin } = calculateAchorOrigin(arrowPlacement);

  return (
    <Popover
      open={!!open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        ...restSlotProps,
        paper: {
          ...paperProps,
          sx: [
            paperStyles,
            {
              overflow: 'inherit',
              [`& .${listClasses.root}`]: { minWidth: 140 },
              [`& .${menuItemClasses.root}`]: { gap: 2 },
            },
            ...(Array.isArray(paperProps?.sx) ? paperProps.sx : [paperProps?.sx]),
          ]
        }
      }}
      {...rest}
    >
      {!arrowProps?.hide && (
        <Arrow
          size={arrowSize}
          offset={arrowOffset}
          placement={arrowPlacement}
          sx={arrowProps?.sx}
        />
      )}

      {children}
    </Popover>
  );
}