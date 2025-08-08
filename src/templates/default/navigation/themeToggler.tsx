import { useThemeToggler } from "@/hooks/themeToggler";
import { styled } from "@mui/material/styles";

export function ThemeToggler() {
  const toggleTheme = useThemeToggler();

  return (
    <StyledButton onClick={toggleTheme}>
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="dark-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </StyledButton>
  );
}

// ======================

const StyledButton = styled('button')(({ theme }) => ({
  all: 'unset',

  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.disabled,
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',

  '&:hover svg': {
    color: theme.palette.text.secondary,
  },

  'svg': {
    display: 'block',
    fontSize: '1.5rem',
    '&.dark-icon': {
      display: 'none',
    },
    transitionProperty: 'color',
    transitionDuration: '100ms',

    ...theme.applyStyles('dark', {
      display: 'none',
      '&.dark-icon': {
        display: 'block',
      }
    }),
  },
}));