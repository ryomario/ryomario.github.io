import WidgetsIcon from '@mui/icons-material/Widgets';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

type SidebarItemProps = {
  href?: string;
  onClick?: () => void;
  miniSidebar?: boolean;
  text: string;
  icon?: React.ReactNode;
  color?: 'error'|'info'|'success'|'warning',
  active?: boolean;
}

export function SidebarItem({
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