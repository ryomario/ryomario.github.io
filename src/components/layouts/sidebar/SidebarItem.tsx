import WidgetsIcon from '@mui/icons-material/Widgets';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { SxProps, Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import React from 'react';

type SidebarItemProps = {
  href?: string;
  onClick?: () => void;
  miniSidebar?: boolean;
  text: string;
  icon?: React.ReactNode;
  color?: 'error'|'info'|'success'|'warning',
  active?: boolean;
  append?: React.ReactNode;
  sx?: SxProps<Theme>;
  depth?: number;
}

export function SidebarItem({
  miniSidebar = false,
  text,
  icon = <WidgetsIcon />,
  color,
  href,
  onClick,
  active = false,
  append,
  sx,
  depth = 1,
}: SidebarItemProps) {
  return (
    <Tooltip title={miniSidebar ? text : null} placement="right" arrow>
      <ListItemButton
        {...(href && {
          component: Link,
          href,
        })}
        selected={active}
        onClick={onClick}
        sx={[
          {
            color: 'inherit',
            ...(color && {
              backgroundColor: (theme) => theme.palette[color].main,
              color: (theme) => theme.palette.getContrastText(theme.palette[color].main),
              '&:hover': {
                backgroundColor: (theme) => theme.palette[color].dark,
              },
            }),
          },
          {
            minHeight: 48,
            pr: 2.5,
            pl: 2.5 * depth,
            justifyContent: miniSidebar ? 'center' : 'initial',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            mr: 'auto',
            color: 'inherit',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text} 
          sx={{
            ml: miniSidebar ? 0 : 3,
            opacity: miniSidebar ? 0 : 1,
            transition: (theme) => theme.transitions.create(['opacity','margin-left'], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.sharp,
            }),
          }}
        />
        {append}
      </ListItemButton>
    </Tooltip>
  )
}