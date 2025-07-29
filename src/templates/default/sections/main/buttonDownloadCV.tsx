import { useProfileData } from "@/contexts/profileDataContext";
import { Link } from "@/i18n/routing";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import styled from '@emotion/styled';
import { useTranslations } from "next-intl";

export function ButtonDownloadCV() {
  const t = useTranslations('MainSection');
  const { name } = useProfileData();

  return (
    <DownloadButton
      download={t('download_filename', { name, ext: 'pdf' })}
      href="/cv/download"
      target="_blank"
      aria-label={t('download_btn')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      <span>
        {t('download_btn')}
      </span>
    </DownloadButton>
  );
}

const DownloadButton = styled(Link)<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  fontSize: '1.125rem',
  border: '1px solid',
  borderColor: 'rgb(199 210 254)',
  padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
  boxShadow: theme.shadows(2),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgb(238 242 255)',
  color: 'rgb(55 65 81)',
  transitionProperty: 'background-color, color',
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease',
  textDecoration: 'none',

  // Hover states
  '&:hover': {
    backgroundColor: 'rgb(99 102 241)',
    color: '#ffffff',
  },

  ...theme.createStyles('dark', {
    borderColor: 'rgb(30 56 81)',
  }),

  // Responsive
  [theme.breakpoints.up('mobile')]: {
    marginBottom: 0 // sm:mb-0
  },

  ['svg']: {
    marginRight: theme.spacing(2), // mr-2
    height: '1.25rem', // h-5
    width: '1.25rem', // w-5

    [theme.breakpoints.up('mobile')]: {
      marginRight: theme.spacing(3), // sm:mr-3
      height: '1.5rem', // sm:h-6
      width: '1.5rem' // sm:w-6
    }
  },

  ['span']: {
    fontSize: '0.875rem', // text-sm

    [theme.breakpoints.up('mobile')]: {
      fontSize: '1.125rem' // sm:text-lg
    }
  },
}));
