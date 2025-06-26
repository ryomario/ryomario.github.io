'use client';

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { CSSObject, styled, SxProps, Theme, useColorScheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LogoutIcon from '@mui/icons-material/Logout';

import { useSettingsContext } from "@/settings/settingsProvider";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import { IDashboardNavData } from "@/types/ILayout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/utils/auth";
import { useAuthContext } from "@/auth/AuthProvider";
import { Logger } from "@/utils/logger";

const sidebarWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: sidebarWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: sidebarWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiPaper-root': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiPaper-root': closedMixin(theme),
        },
      },
    ],
  }),
);

export type DashboardLayoutProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  slotProps?: {
    nav?: {
      data?: IDashboardNavData;
    };
  };
}

export function DashboardLayout({
  sx,
  children,
  slotProps,
  ...rest
}: DashboardLayoutProps) {
  const settings = useSettingsContext();
  const { mode, setMode, systemMode } = useColorScheme();

  const pathname = usePathname();
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      await checkUserSession?.();
    } catch(error) {
      Logger.debug(error, 'Logout error');
    }
  }

  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    if(mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
  },[mode, systemMode]);

  const isDarkMode = useMemo(() => settings.state.colorScheme === 'dark',[settings.state.colorScheme]);
  
  return (
    <LayoutRoot
      id="root__layout"
      sx={sx}
      {...rest}
    >
      {/** @slot HEADER **/}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              settings.setState({ miniSidebar: !settings.state.miniSidebar });
            }}
            sx={{ mr: 2 }}
          >
            {
              settings.state.miniSidebar
              ? <MenuOpenIcon/>
              : <MenuIcon/>
            }
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Portofolio
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label={isDarkMode ? "change to light mode" : "change to dark mode"}
            onClick={() => {
              setMode(isDarkMode ? 'light' : 'dark');
              settings.setState({ colorScheme: isDarkMode ? 'light' : 'dark' });
            }
            }
          >
            {
              isDarkMode ? <DarkModeIcon/> : <LightModeIcon/>
            }
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/** @slot Sidebar  */}
      <Drawer
        open={!settings.state.miniSidebar}
        variant="permanent"
      >
        <Toolbar />
        <Box className="sidebar-nav" sx={{ flexGrow: 1 }}>
          {slotProps?.nav?.data?.map((list, i) => <React.Fragment key={`${list.subheader}-${i}`}>
            {i > 0 && <Divider />}
            <List
              subheader={
                list.subheader ? (
                  <ListSubheader component="div" sx={{
                    display: settings.state.miniSidebar ? 'none' : 'block',
                  }}>
                    {list.subheader}
                  </ListSubheader>
                ) : undefined
              }
            >{list.items.map((item, j) => (
              <SidebarItem
                key={`${list.subheader}-${i}-${item.title}-${j}`}
                text={item.title}
                icon={item.icon}
                href={item.path}
                miniSidebar={settings.state.miniSidebar}
                active={item.path ? isActive(item.path) : false}
              />
            ))}</List>
          </React.Fragment>)}
        </Box>
        <SidebarItem
          text="Logout"
          icon={<LogoutIcon/>}
          miniSidebar={settings.state.miniSidebar}
          color="error"
          onClick={handleLogout}
        />
      </Drawer>

      {/** @slot Main */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </LayoutRoot>
  );
}

const LayoutRoot = styled('div')`
display: flex;
`;

type SidebarItemProps = {
  href?: string;
  onClick?: () => void;
  miniSidebar?: boolean;
  text: string;
  icon?: React.ReactNode;
  color?: 'error'|'info'|'success'|'warning',
  active?: boolean;
}
function SidebarItem({
  miniSidebar = false,
  text,
  icon = <WidgetsIcon />,
  color,
  href,
  onClick,
  active = false,
}: SidebarItemProps) {
  return (
    <ListItem 
      {...(href && {
        component: Link,
        href,
      })}
      disablePadding
      sx={{
        display: 'block',
        color: 'inherit',
        ...(color && {
          backgroundColor: (theme) => theme.palette[color].main,
          color: (theme) => theme.palette.getContrastText(theme.palette[color].main),
        }),
      }}
    >
      <ListItemButton
        selected={active}
        onClick={onClick}
        sx={{
          minHeight: 48,
          px: 2.5,
          justifyContent: miniSidebar ? 'center' : 'initial',
        }}
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
      </ListItemButton>
    </ListItem>
  )
}