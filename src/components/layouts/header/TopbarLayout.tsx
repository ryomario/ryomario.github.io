import { useSettingsContext } from "@/settings/settingsProvider";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Typography from "@mui/material/Typography";
import { DarkModeToggle } from "./DarkModeToggle";
import { useProfileData } from "@/contexts/profileDataContext";
import { date2localeString, date2string } from "@/lib/date";

export function TopbarLayout() {
  const profileData = useProfileData();
  const settings = useSettingsContext();

  return (
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
        <Typography variant="caption" mr={2}>Last updated : {date2localeString(profileData.lastUpdated, true)}</Typography>
        <DarkModeToggle
          edge="end"
          color="inherit"
        />
      </Toolbar>
    </AppBar>
  )
}