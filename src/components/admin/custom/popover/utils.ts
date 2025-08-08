import { AnchorOriginProps, PopoverArrowProps } from "./types";

const POPOVER_DISTANCE = 0.75;


export function calculateAchorOrigin(arrow: PopoverArrowProps['placement']): AnchorOriginProps {
  let props: AnchorOriginProps;

  switch(arrow) {
    case 'top-left': props = {
      paperStyles: { ml: -POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
    }; break;
    case 'top-center': props = {
      paperStyles: undefined,
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      transformOrigin: { vertical: 'top', horizontal: 'center' },
    }; break;
    case 'top-right': props = {
      paperStyles: { ml: POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      transformOrigin: { vertical: 'top', horizontal: 'right' },
    }; break;

    case 'bottom-left': props = {
      paperStyles: { ml: -POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'top', horizontal: 'left' },
      transformOrigin: { vertical: 'bottom', horizontal: 'left' },
    }; break;
    case 'bottom-center': props = {
      paperStyles: undefined,
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      transformOrigin: { vertical: 'bottom', horizontal: 'center' },
    }; break;
    case 'bottom-right': props = {
      paperStyles: { ml: POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      transformOrigin: { vertical: 'bottom', horizontal: 'right' },
    }; break;

    case 'left-top': props = {
      paperStyles: { ml: -POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
    }; break;
    case 'left-center': props = {
      paperStyles: undefined,
      anchorOrigin: { vertical: 'center', horizontal: 'right' },
      transformOrigin: { vertical: 'center', horizontal: 'left' },
    }; break;
    case 'left-bottom': props = {
      paperStyles: { ml: POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      transformOrigin: { vertical: 'bottom', horizontal: 'left' },
    }; break;

    case 'right-top': props = {
      paperStyles: { ml: -POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'top', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'right' },
    }; break;
    case 'right-center': props = {
      paperStyles: undefined,
      anchorOrigin: { vertical: 'center', horizontal: 'left' },
      transformOrigin: { vertical: 'center', horizontal: 'right' },
    }; break;
    case 'right-bottom': props = {
      paperStyles: { ml: POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'bottom', horizontal: 'right' },
    }; break;

    default: props = {
      paperStyles: { ml: POPOVER_DISTANCE },
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      transformOrigin: { vertical: 'top', horizontal: 'right' },
    }; break;
  }

  return props;
}