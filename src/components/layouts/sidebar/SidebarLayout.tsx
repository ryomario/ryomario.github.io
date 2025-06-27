import { CSSObject, styled, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { IDashboardNavData } from "@/types/ILayout";
import React, { useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import { SidebarItem } from "./SidebarItem";
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/auth/AuthProvider";
import { logout } from "@/utils/auth";
import { Logger } from "@/utils/logger";
import { useSettingsContext } from "@/settings/settingsProvider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const sidebarWidth = 240;

type Props = {
  data?: IDashboardNavData;
}

export function SidebarLayout({
  data = [],
}: Props) {
  const settings = useSettingsContext();

  const miniSidebar = useMemo(() => settings.state.miniSidebar, [settings.state.miniSidebar]);
  
  const pathname = usePathname();

  const { checkUserSession } = useAuthContext();

  const [confirmLogoutDialog, setConfirmLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCloseConfirmLogoutDialog = () => {
    if(isLoggingOut) {
      return;
    }
    setConfirmLogoutDialog(false);
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      await checkUserSession?.();
    } catch(error) {
      Logger.debug(error, 'Logout error');
    } finally {
      setIsLoggingOut(false);
    }
  }

  const isActive = (href: string) => pathname.startsWith(href);


  return (
    <Drawer
      open={!miniSidebar}
      variant="permanent"
    >
      <Toolbar />
      <Box sx={{ flexGrow: 1 }}>
        {data.map((list, i) => <React.Fragment key={`${list.subheader}-${i}`}>
          {i > 0 && <Divider />}
          <List
            subheader={
              list.subheader ? (
                <ListSubheader component="div" sx={{
                  display: miniSidebar ? 'none' : 'block',
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
              miniSidebar={miniSidebar}
              active={item.path ? isActive(item.path) : false}
            />
          ))}</List>
        </React.Fragment>)}
      </Box>
      <SidebarItem
        text="Logout"
        icon={<LogoutIcon/>}
        miniSidebar={miniSidebar}
        color="error"
        onClick={() => setConfirmLogoutDialog(true)}
      />
      
      {/** @slot dialog confirm logout */}
      <Dialog
        open={confirmLogoutDialog}
        onClose={handleCloseConfirmLogoutDialog}
      >
        <DialogTitle>Confirm Logout!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to logout from this session and leave this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoggingOut}
            onClick={handleCloseConfirmLogoutDialog}
          >Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >Yes</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  )
}

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