import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "@/i18n/routing";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { LanguageSwitcher } from "./languageSwitcher";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { ThemeToggler } from "./themeToggler";
import { useDataContext } from "@/contexts/dataContext";

export default function Navbar() {
  const { getLinkHref } = useTemplatePageRouter();
  const [showMenu, setShowMenu] = useState(false);
  const t = useTranslations('Navbar');
  const { data: { profile } } = useDataContext();
  const { hireable } = profile;

  function toggleMenu() {
    if (!showMenu) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
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
      <div className={`nav-menu-wrapper ${showMenu ? '' : 'hidden'}`}>
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
        {hireable && <button className="unset-all-styles" aria-label={t('buttons.hireme')}>
          {t('buttons.hireme')}
        </button>}
      </div>
    </Nav>
  );
}

// ====================================================================================

const Nav = styled.nav<{ theme?: TemplateTheme }>(({ theme }) => ({
  '& > .nav-wrapper': {
    zIndex: 10,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "80rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    [theme.breakpoints.tablet]: {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },

    '.nav-left-wrapper': {
      display: 'flex',
      [theme.breakpoints.tablet]: {
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
      [theme.breakpoints.tablet]: {
        display: 'none',
      },
    },
    '.nav-wrapper-menu': {
      display: 'none',
      margin: 0,
      marginTop: theme.spacing(5),
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(5),
      boxShadow: theme.shadows(2),

      [theme.breakpoints.tablet]: {
        display: 'flex',
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(3),
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
        color: theme.colors.text.secondary.light,
        ...theme.createStyles('dark', {
          color: theme.colors.text.secondary.dark,
        }),
        transitionProperty: 'color',
        transitionDuration: '200ms',
        '&:hover': {
          color: theme.colors.text.primary.light,
          ...theme.createStyles('dark', {
            color: theme.colors.text.primary.dark,
          }),
        },
        marginBottom: theme.spacing(2),
        [theme.breakpoints.up('mobile')]: {
          marginLeft: theme.spacing(4),
          marginRight: theme.spacing(4),
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
        }
      }
    },
    '.nav-wrapper-right': {
      display: 'none',
      [theme.breakpoints.tablet]: {
        display: 'flex',
        alignItems: 'center',
        flex: '1 1 0%',
        justifyContent: 'flex-end',
        gap: theme.spacing(3),
      },
    },
  },
  '& > .nav-menu-wrapper': {
    display: 'block',
    margin: 0,
    marginTop: theme.spacing(3),
    padding: theme.spacing(5),
    boxShadow: theme.shadows(3),

    justifyContent: 'center',
    alignItems: 'center',

    [theme.breakpoints.up(theme.breakpoints.values.mobile)]: {
      display: 'flex',
      marginLeft: theme.spacing(4),
      padding: 0,
      boxShadow: 'none',
    },

    [theme.breakpoints.tablet]: {
      display: "none !important",
    },
    '&.hidden': {
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

      [theme.breakpoints.up('mobile')]: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      }
    },
    'a': {
      color: theme.colors.text.secondary.light,
      '&:hover': {
        color: theme.colors.text.primary.light,
      },
      ...theme.createStyles('dark', {
        color: theme.colors.text.secondary.dark,
        '&:hover': {
          color: theme.colors.text.primary.dark,
        },
      }),
    },
    'button': {
      fontSize: '1rem',
      backgroundColor: '#6366f1',
      color: '#fff',
      borderRadius: '0.375rem',
      boxShadow: theme.shadows(1),
      marginBlock: 0,
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      transitionProperty: 'background-color',
      transitionDuration: '300ms',
      '&:hover': {
        backgroundColor: '#4f46e5',
      },
      [theme.breakpoints.mobile]: {
        marginTop: theme.spacing(5),
      }
    },
  },
}));

const LogoImg = styled.img<{ theme?: TemplateTheme }>(({ theme }) => ({
  transitionProperty: 'filter',
  transitionDuration: '300ms',

  ...theme.createStyles('dark', {
    filter: 'invert(100%)',
  }),

  [theme.breakpoints.down(360)]: {
    display: 'none'
  }
}));

const HereableButton = styled.button<{ theme?: TemplateTheme }>(({ theme }) => ({
  fontSize: '1rem',
  fontFamily: 'sans-serif-medium',
  backgroundColor: '#6366f1',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#4f46e5',
  },
  color: '#fff',
  borderRadius: '0.375rem',
  boxShadow: theme.shadows(0.5),

  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),

  transitionDuration: '300ms',
  transitionProperty: 'background-color',

  display: 'none',
  [theme.breakpoints.tablet]: {
    display: 'block',
  },
}));

const ToggleButton = styled.button<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  marginLeft: theme.spacing(5),
  borderRadius: '0.375rem',
  padding: theme.spacing(2.5),

  color: theme.colors.text.primary.light,
  ...theme.createStyles('dark', {
    color: theme.colors.text.primary.dark,
  }),
  cursor: 'pointer',

  'svg': {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));