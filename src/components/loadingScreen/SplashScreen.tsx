'use client';

import { styled, SxProps, Theme } from "@mui/material/styles";
import React from "react";

import Portal from "@mui/material/Portal";
import { LogoSVG } from "@/assets/icons/logo";

export type SplashScreenProps = React.ComponentProps<'div'> & {
  portal?: boolean;
  sx?: SxProps<Theme>;
}

export function SplashScreen({ portal = true, sx, ...rest }: SplashScreenProps) {
  const content = (
    <div style={{ overflow: 'hidden' }}>
      <LoadingContent sx={sx} {...rest}>
        <LogoSVG width={100} height={100}/>
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