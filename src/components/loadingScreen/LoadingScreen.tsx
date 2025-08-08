'use client';

import { styled, SxProps, Theme } from "@mui/material/styles";
import React from "react";

import Portal from "@mui/material/Portal";
import LinearProgress from "@mui/material/LinearProgress";

export type SplashScreenProps = React.ComponentProps<'div'> & {
  portal?: boolean;
  sx?: SxProps<Theme>;
}

export function LoadingScreen({ portal, sx, ...rest }: SplashScreenProps) {
  const content = (
    <LoadingContent sx={sx} {...rest}>
      <LinearProgress color="inherit" variant="indeterminate" sx={{ width: 1, maxWidth: 360 }} />
    </LoadingContent>
  )

  if (portal) {
    return <Portal>{content}</Portal>
  }

  return content;
}

const LoadingContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  display: 'flex',
  // minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))