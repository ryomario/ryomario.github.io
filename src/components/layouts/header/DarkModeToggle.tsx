import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import React, { useEffect, useMemo } from "react";

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from "@mui/material/styles";
import { useSettingsContext } from "@/settings/settingsProvider";

type Props = Omit<IconButtonProps, 'onClick'> & {
  darkIcon?: React.ReactNode;
  lightIcon?: React.ReactNode;
};

export function DarkModeToggle({
  darkIcon = <DarkModeIcon/>,
  lightIcon = <LightModeIcon/>,
  ...rest
}: Props) {
  const settings = useSettingsContext();
  const { mode, setMode, systemMode } = useColorScheme();

  useEffect(() => {
    if(mode === 'system' && systemMode) {
      settings.setState({ colorScheme: systemMode });
    }
  },[mode, systemMode]);

  const isDarkMode = useMemo(() => settings.state.colorScheme === 'dark',[settings.state.colorScheme]);
  
  return (
    <IconButton
      {...rest}
      aria-label={isDarkMode ? "change to light mode" : "change to dark mode"}
      onClick={() => {
        setMode(isDarkMode ? 'light' : 'dark');
        settings.setState({ colorScheme: isDarkMode ? 'light' : 'dark' });
      }
      }
    >
      {
        isDarkMode ? darkIcon : lightIcon
      }
    </IconButton>
  )
}