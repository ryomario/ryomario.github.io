import { useTranslations } from "next-intl";
import { HeroSection } from "./heroSection";
import { Link } from "@/i18n/routing";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { GridProjects } from "../projects/gridProjects";
import { darken, styled } from "@mui/material/styles";

export function MainSection() {
  const t = useTranslations('MainSection');
  const { getLinkHref } = useTemplatePageRouter();

  return (
    <>
      <HeroSection />
      <SectionHeader>{t('projects_header')}</SectionHeader>
      <GridProjects maxItems={3} filter={{ published: true }}/>
      <ButtonWrapper>
        <LinkButton
          href={getLinkHref('projects')}
        >
          {t('btn_more_projects')}
        </LinkButton>
      </ButtonWrapper>
    </>
  );
}

// ============================================================================

const SectionHeader = styled('h1')(({ theme }) => ({
  width: '100%',
  marginBlock: theme.spacing(4),
  textAlign: 'center',
  fontWeight: 500,

  [theme.breakpoints.up('sm')]: {
    marginBlock: theme.spacing(8),
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(3),

  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(5),
  },
}));

const LinkButton = styled(Link)(({ theme }) => ({
  all: 'unset',

  cursor: 'pointer',
  fontSize: '1rem',
  backgroundColor: theme.palette.secondary.main,
  color: '#ffffff',

  transition: 'background-color 200ms',

  ['&:hover']: {
    backgroundColor: darken(theme.palette.secondary.main, 0.15),
  },

  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],

  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,

  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}));
