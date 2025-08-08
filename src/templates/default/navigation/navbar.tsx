import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "./languageSwitcher";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { ThemeToggler } from "./themeToggler";
import { useDataContext } from "@/contexts/dataContext";
import { darken, styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";

export default function Navbar() {
  const { getLinkHref } = useTemplatePageRouter();
  const [showMenu, setShowMenu] = useState(false);
  const t = useTranslations('Navbar');
  const { data: { profile } } = useDataContext();
  const { hireable } = profile;

  function toggleMenu() {
    setShowMenu(old => !old);
  }

  return (
    <Nav className="container">
      <div className="nav-wrapper">
        <div className="nav-left-wrapper">
          <Link href={getLinkHref('/')} className="logo-wrapper">
            <span className="sr-only">Ryomario</span>
            <LogoImg
              className="logo"
              src="/icon.svg"
              alt="Ryomario logo"
              height={35}
              width={35}
            />
          </Link>
        </div>
        <div className="nav-wrapper-mobile">
          <LanguageSwitcher />
          <ThemeToggler />
          <ToggleButton type="button" onClick={toggleMenu} className="unset-all-styles">
            {
              showMenu ? <>
                <span className="sr-only">{t('srOnly.closeMenu')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </> : <>
                <span className="sr-only">{t('srOnly.openMenu')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </>
            }
          </ToggleButton>
        </div>
        <div className="nav-wrapper-menu">
          <Link
            href={getLinkHref('projects')}
            aria-label={t('menus.projects')}
          >
            {t('menus.projects')}
          </Link>
          <Link
            href={getLinkHref('about')}
            aria-label={t('menus.aboutme')}
          >
            {t('menus.aboutme')}
          </Link>
        </div>
        <div className="nav-wrapper-right">
          {hireable && <HereableButton className="unset-all-styles" aria-label={t('buttons.hireme')}>
            {t('buttons.hireme')}
          </HereableButton>}
          <LanguageSwitcher />
          <ThemeToggler />
        </div>
      </div>
      <Collapse in={showMenu}>
        <div className="nav-menu-wrapper">
          <Link
            href={getLinkHref('projects')}
            aria-label={t('menus.projects')}
          >
            {t('menus.projects')}
          </Link>
          <Link
            href={getLinkHref('about')}
            aria-label={t('menus.aboutme')}
          >
            {t('menus.aboutme')}
          </Link>
          {hireable && <HereableButton className="unset-all-styles" aria-label={t('buttons.hireme')}>
            {t('buttons.hireme')}
          </HereableButton>}
        </div>
      </Collapse>
    </Nav>
  );
}

// ====================================================================================

const Nav = styled('nav')(({ theme }) => ({
  boxShadow: theme.shadows[2],

  [theme.breakpoints.up('sm')]: {
    boxShadow: 'none',
  },
  '& > .nav-wrapper': {
    zIndex: 10,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: theme.breakpoints.values.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },

    '.nav-left-wrapper': {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        flex: '1 1 0%',
      },

      '& > .logo-wrapper': {
        margin: '-0.375rem',
        padding: '0.375rem',
        cursor: 'pointer',
      }
    },

    '.nav-wrapper-mobile': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    '.nav-wrapper-menu': {
      display: 'none',
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(5),
      boxShadow: theme.shadows[2],

      [theme.breakpoints.up('md')]: {
        display: 'flex',
        marginLeft: theme.spacing(2),
        padding: 0,
        boxShadow: 'none',
      },

      'a': {
        display: 'block',
        textDecoration: 'none',
        textAlign: 'left',
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        transitionProperty: 'color',
        transitionDuration: '200ms',
        '&:hover': {
          color: theme.palette.text.primary,
        },
        marginBottom: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          marginInline: theme.spacing(2),
          marginBlock: theme.spacing(1),
        }
      }
    },
    '.nav-wrapper-right': {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        alignItems: 'center',
        flex: '1 1 0%',
        justifyContent: 'flex-end',
        gap: theme.spacing(3),
      },
    },
  },
  '& .nav-menu-wrapper': {
    display: 'block',
    margin: 0,
    marginTop: theme.spacing(2),
    padding: theme.spacing(2.5),

    justifyContent: 'center',
    alignItems: 'center',

    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      marginLeft: theme.spacing(4),
      padding: 0,
    },

    [theme.breakpoints.up('md')]: {
      display: "none !important",
    },

    'a, button': {
      display: 'block',
      textAlign: 'left',
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      textDecoration: 'none',
      cursor: 'pointer',

      marginTop: theme.spacing(2),

      [theme.breakpoints.up('sm')]: {
        marginInline: theme.spacing(2),
        marginBlock: theme.spacing(1),
      }
    },
    'a': {
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    'button': {
      fontSize: '0.9rem',
      fontWeight: 700,
      paddingBlock: theme.spacing(0.5),
      paddingInline: theme.spacing(1.5),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(4),
      }
    },
  },
}));

const LogoImg = styled('img')(({ theme }) => ({
  transitionProperty: 'filter',
  transitionDuration: '300ms',

  ...theme.applyStyles('dark', {
    filter: 'invert(100%)',
  }),

  [theme.breakpoints.down(360)]: {
    display: 'none'
  }
}));

const HereableButton = styled('button')(({ theme }) => ({
  fontSize: '1rem',
  backgroundColor: theme.palette.secondary.main,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: darken(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
  },
  color: theme.palette.secondary.contrastText,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],

  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),

  transitionDuration: '300ms',
  transitionProperty: 'background-color',

  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const ToggleButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  borderRadius: '0.375rem',
  padding: theme.spacing(1),

  color: theme.palette.text.primary,
  cursor: 'pointer',

  'svg': {
    width: '1.5rem',
    height: '1.5rem',
  },
}));