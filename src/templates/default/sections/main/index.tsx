import { useTranslations } from "next-intl";
import styled from '@emotion/styled';
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { HeroSection } from "./heroSection";
import { Link } from "@/i18n/routing";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { adjustColorBrightness } from "@/lib/colors";
import { GridProjects } from "../projects/gridProjects";

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

const SectionHeader = styled.h1<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  marginBlock: theme.spacing(10),
  textAlign: 'center',
  fontWeight: 500,

  [theme.breakpoints.up('mobile')]: {
    marginBlock: theme.spacing(15),
  },
}));

const ButtonWrapper = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(8),

  [theme.breakpoints.up('mobile')]: {
    marginTop: theme.spacing(10),
  },
}));

const LinkButton = styled(Link)<{ theme?: TemplateTheme }>(({ theme }) => ({
  all: 'unset',

  cursor: 'pointer',
  fontSize: '1rem',
  backgroundColor: theme.colors.secondary.light,
  color: '#ffffff',

  transition: 'background-color 200ms',

  ['&:hover']: {
    backgroundColor: adjustColorBrightness(theme.colors.secondary.light, -15),
  },

  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows(1),

  padding: `${theme.spacing(2.5)} ${theme.spacing(5)}`,

  [theme.breakpoints.up('mobile')]: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },

  ...theme.createStyles('dark', {
    backgroundColor: theme.colors.secondary.dark,

    ['&:hover']: {
      backgroundColor: adjustColorBrightness(theme.colors.secondary.dark, -15),
    },
  }),
}));
