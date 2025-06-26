'use client';

import { styled, SxProps, Theme } from "@mui/material/styles";
import React from "react";

import logo from "@/app/icon.svg";
import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

export type SplashScreenProps = React.ComponentProps<'div'> & {
  portal?: boolean;
  sx?: SxProps<Theme>;
}

export function SplashScreen({ portal = true, sx, ...rest }: SplashScreenProps) {
  const content = (
    <div style={{ overflow: 'hidden' }}>
      <LoadingContent sx={sx} {...rest}>
        <Stack spacing={2}>
          <img src={logo.src} width={100}/>
          <LinearProgress variant="indeterminate"/>
        </Stack>
      </LoadingContent>
    </div>
  )

  if(portal) {
    return <Portal>{content}</Portal>
  }

  return content;
}

const LoadingContent = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9999,
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'fixed',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.vars?.palette.background.default,
}))