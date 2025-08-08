'use client';

import Link from "@mui/material/Link";
import RouterLink from "next/link";
import { styled, SxProps, Theme } from "@mui/material/styles";
import React from "react";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Breadcrumbs from "@mui/material/Breadcrumbs";

export type CustomBreadCrumbsLink = {
  name: string;
  href?: string;
  icon?: React.ReactNode;
}

export type CustomBreadCrumbsProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  heading?: string;
  backHref?: string;
  action?: React.ReactNode;
  links?: CustomBreadCrumbsLink[];
};

export function CustomBreadCrumbs({
  sx,
  action,
  backHref,
  heading,
  links = [],
  ...rest
}: CustomBreadCrumbsProps) {
  const lastLink = links[links.length - 1]?.name;

  const renderHeading = () => (
    <Heading>
      {backHref ? (
        <Link
          component={RouterLink}
          color="inherit"
          underline="none"
          href={backHref}
          sx={(theme) => ({
            verticalAlign: 'middle',
            ['& .icon']: {
              verticalAlign: 'inherit',
              transform: 'translateY(-2px)',
              ml: { xs: '-14px', md: '-18px' },
              transition: theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.sharp,
              }),
            },
            '&:hover': {
              ['& .icon']: {
                opacity: 0.48,
              }
            },
          })}
        >
          <ArrowBackIosIcon className="icon" sx={{ width: 18 }}/>
          {heading}
        </Link>
      ) : heading}
    </Heading>
  );

  const renderLinks = () => (
    <Breadcrumbs>
      {links.map((link, i) => (
        <Link
          key={link.name ?? i}
          component={RouterLink}
          href={link.href ?? '#'}
          color="inherit"
          underline="hover"
          sx={{
            display: 'inline-flex',
            ...((link.name === lastLink) && { pointerEvents: 'none', color: 'text.primary' }),
          }}
        >
          {link.icon && <ItemIcon>{link.icon}</ItemIcon>}
          {link.name}
        </Link>
      ))}
    </Breadcrumbs>
  );

  return (
    <Root sx={sx} {...rest}>
      <Container>
        <CustomBreadCrumbsContent>
          {(heading || backHref) && renderHeading()}
          {!!links.length && renderLinks()}
        </CustomBreadCrumbsContent>
        {action}
      </Container>
    </Root>
  );
}

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
}));

const CustomBreadCrumbsContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  gap: theme.spacing(2),
  flexDirection: 'column',
}));

const Heading = styled('h6')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  padding: 0,
  display: 'inline-flex',
}));

const Separator = styled('span')(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.disabled,
}));

const ItemIcon = styled('span')(() => ({
  display: 'inherit',
  
  '& > :first-child': { width: 20, height: 20 },
}));
