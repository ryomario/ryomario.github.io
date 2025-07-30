import { useTranslations } from "next-intl";
import styled from "@emotion/styled";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { adjustColorBrightness } from "@/lib/colors";
import { useDataContext } from "@/contexts/dataContext";

export function Footer() {
  const { data: { profile } } = useDataContext();
  const { socialLinks, lastUpdated } = profile;

  const t = useTranslations('Footer');

  return (
    <StyledFooter className={`${FooterClasses.root} container`}>
      <div className={FooterClasses.topSide}>
        <p className={FooterClasses.heading}>
          {t('follow_me')}
        </p>
        <div className={FooterClasses.linkSocial_container}>
          {socialLinks.website && <a href={socialLinks.website} className={FooterClasses.linkSocial} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </a>}
          {socialLinks.github && <a href={socialLinks.github} className={FooterClasses.linkSocial} target="_blank">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>}
          {socialLinks.linkedin && <a href={socialLinks.linkedin} className={FooterClasses.linkSocial} target="_blank">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>}
          {socialLinks.codepen && <a href={socialLinks.codepen} className={FooterClasses.linkSocial} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.7L33 24l11-7.3V9.3L33 2L22 9.3V16.7z M44 16.7L33 9.3l-11 7.4 M22 9.3l11 7.3 l11-7.3 M33 2v7.3 M33 16.7V24 "></path>
            </svg>
          </a>}
        </div>
      </div>
      <div className={FooterClasses.botSide}>
        &copy; {lastUpdated.getFullYear()}
        <a
          href="https://github.com/ryomario/ryomario.github.io/"
          target="__blank"
        >
          ryomario.github.io
        </a>
      </div>
    </StyledFooter>
  );
}

// ================================

const FooterClasses = {
  root: 'Footer-root',
  topSide: 'Footer-top',
  botSide: 'Footer-bot',
  heading: 'Footer-topHeading',
  linkSocial: 'Footer-linkSocial',
  linkSocial_container: 'Footer-linkSocial_container',
};

const StyledFooter = styled.footer<{ theme?: TemplateTheme }>(({ theme }) => ({
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(8),
  marginTop: theme.spacing(20),

  borderTop: '2px solid #dbeafe',
  ...theme.createStyles('dark', {
    borderTopColor: '#1e293b',
  }),

  [theme.breakpoints.up('mobile')]: {
    paddingTop: theme.spacing(30),
  },

  [`.${FooterClasses.topSide}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(12),

    [theme.breakpoints.up('mobile')]: {
      marginBottom: theme.spacing(28),
    },
  },

  [`.${FooterClasses.botSide}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    color: '#64748b',
    ...theme.createStyles('dark', {
      color: '#e2e8f0',
    }),
    '& > a': {
      all: 'unset',

      cursor: 'pointer',
      marginLeft: theme.spacing(2),
      transitionDuration: '500ms',
      transitionProperty: 'text-decoration, color',
      '&:hover': {
        textDecoration: 'underline',
        color: '#7c3aed',
        ...theme.createStyles('dark', {
          color: '#a78bfa',
        }),
      }
    },
  },

  [`.${FooterClasses.heading}`]: {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    color: theme.colors.text.primary.light,
    marginBottom: theme.spacing(5),
    [theme.breakpoints.up('tablet')]: {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
    },
    ...theme.createStyles('dark', {
      color: theme.colors.text.primary.dark,
    }),
  },

  [`.${FooterClasses.linkSocial_container}`]: {
    display: 'flex',
    gap: theme.spacing(4),
    [theme.breakpoints.up('mobile')]: {
      gap: theme.spacing(8),
    },
  },
  [`.${FooterClasses.linkSocial}`]: {
    all: 'unset',

    cursor: 'pointer',
    borderRadius: theme.spacing(1),
    color: theme.colors.text.disabled.light,
    backgroundColor: theme.colors.background.paper.light,

    padding: theme.spacing(4),
    transition: 'all 300ms ease',
    '&:hover': {
      color: theme.colors.secondary.light,
      backgroundColor: adjustColorBrightness(theme.colors.background.paper.light, -5),
      boxShadow: theme.shadows(1),
    },
    ...theme.createStyles('dark', {
      backgroundColor: theme.colors.background.paper.dark,
      color: theme.colors.text.disabled.dark,
      '&:hover': {
        backgroundColor: adjustColorBrightness(theme.colors.background.paper.light, -5),
        color: theme.colors.secondary.dark,
      }
    }),

    'svg': {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',

      width: '1em',
      height: '1em',

      [theme.breakpoints.up('mobile')]: {
        fontSize: '1.5rem',
        lineHeight: '2rem',
      },
      [theme.breakpoints.up('tablet')]: {
        fontSize: '1.875rem',
        lineHeight: '2.25rem',
      },
    }
  },
}));