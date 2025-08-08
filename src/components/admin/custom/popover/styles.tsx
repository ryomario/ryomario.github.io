import { alpha, CSSObject, styled } from "@mui/material/styles";
import { PopoverArrowProps } from "./types";

const centerStyles: Record<string, CSSObject> = {
  hCenter: { left: 0, right: 0, margin: 'auto' },
  vCenter: { top: 0, bottom: 0, margin: 'auto' },
};

const arrowDirection: Record<string, CSSObject> = {
  top: { top: 0, rotate: '135deg', translate: '0 -50%' },
  bottom: { bottom: 0, rotate: '-45deg', translate: '0 50%' },
  left: { rotate: '45deg', translate: '-50% 0' },
  right: { rotate: '-135deg', translate: '50% 0' },
};

export const Arrow = styled('span', {
  shouldForwardProp: (prop: string) => !['size','placement','offset','sx'].includes(prop),
})<PopoverArrowProps>(({ offset = 0, size = 0, theme }) => {
  return {
    width: size,
    height: size,
    position: 'absolute',
    backdropFilter: '6px',
    borderBottomLeftRadius: size / 4,
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    backgroundColor: (theme.vars?.palette || theme.palette).background.paper,
    border: `solid 1px ${alpha((theme.vars?.palette || theme.palette).grey['500'], 0.12)}`,
    ...theme.applyStyles('dark', {
      border: `solid 1px ${alpha((theme.vars?.palette || theme.palette).common.black, 0.12)}`,
    }),

    variants: [
      // top*
      {
        props: ({ placement }) => placement?.startsWith('top-'),
        style: { ...arrowDirection.top },
      },
      {
        props: { placement: 'top-left' },
        style: { left: offset, right: 'auto' },
      },
      {
        props: { placement: 'top-center' },
        style: { ...centerStyles.hCenter },
      },
      {
        props: { placement: 'top-right' },
        style: { right: offset, left: 'auto' },
      },
      // bottom*
      {
        props: ({ placement }) => placement?.startsWith('bottom-'),
        style: { ...arrowDirection.bottom },
      },
      {
        props: { placement: 'bottom-left' },
        style: { left: offset, right: 'auto' },
      },
      {
        props: { placement: 'bottom-center' },
        style: { ...centerStyles.hCenter },
      },
      {
        props: { placement: 'bottom-right' },
        style: { right: offset, left: 'auto' },
      },
      // left*
      {
        props: ({ placement }) => placement?.startsWith('left-'),
        style: { left: 0, right: 'auto', ...arrowDirection.left },
      },
      {
        props: { placement: 'left-top' },
        style: { top: offset },
      },
      {
        props: { placement: 'left-center' },
        style: { ...centerStyles.vCenter },
      },
      {
        props: { placement: 'left-bottom' },
        style: { bottom: offset },
      },
      // right*
      {
        props: ({ placement }) => placement?.startsWith('right-'),
        style: { right: 0, left: 'auto', ...arrowDirection.right },
      },
      {
        props: { placement: 'right-top' },
        style: { top: offset },
      },
      {
        props: { placement: 'right-center' },
        style: { ...centerStyles.vCenter },
      },
      {
        props: { placement: 'right-bottom' },
        style: { bottom: offset },
      },
    ],
  };
});