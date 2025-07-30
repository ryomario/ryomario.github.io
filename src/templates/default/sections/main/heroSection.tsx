import { useTranslations } from "next-intl";
import styled from '@emotion/styled';
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import ilustration from "./illustration.svg";
import { ButtonDownloadCV } from "./buttonDownloadCV";
import { useDataContext } from "@/contexts/dataContext";

export function HeroSection() {
  const t = useTranslations('MainSection');
  const { data: { profile } } = useDataContext();
  const { name, headline } = profile;

  return (
    <HeroContainer>
      <TextContainer>
        <Heading>{t('heading_1', { name })}</Heading>
        <Subheading>{headline}</Subheading>
        <ButtonWrapper>
          <ButtonDownloadCV />
        </ButtonWrapper>
      </TextContainer>
      <ImageContainer>
        <HeroImage
          src={ilustration.src}
          alt={t('hero_img_alt')}
        />
      </ImageContainer>
      {/**TODO - refactor other components */}
    </HeroContainer>
  );
}

// ============================================================================

const HeroContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(12),

  [theme.breakpoints.up('mobile')]: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  [theme.breakpoints.up('tablet')]: {
    marginTop: theme.spacing(2)
  }
}));

const TextContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  textAlign: 'center',

  [theme.breakpoints.up('tablet')]: {
    width: '33.333333%',
    textAlign: 'left'
  }
}));

const Heading = styled.h1<{ theme?: TemplateTheme }>(({ theme }) => ({
  fontSize: '1.5rem',
  textTransform: 'uppercase',
  color: theme.colors.text.primary.light,
  textAlign: 'center',

  [theme.breakpoints.up('mobile')]: {
    textAlign: 'left'
  },

  [theme.breakpoints.up('tablet')]: {
    fontSize: '1.875rem'
  },

  [theme.breakpoints.up('desktop')]: {
    fontSize: '2.25rem'
  },

  ...theme.createStyles('dark', {
    color: theme.colors.text.primary.dark,
  }),
}));

const Subheading = styled.p<{ theme?: TemplateTheme }>(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  color: theme.colors.text.secondary.light,
  textAlign: 'center',

  [theme.breakpoints.up('mobile')]: {
    textAlign: 'left',
    fontSize: '1.25rem'
  },

  [theme.breakpoints.up('tablet')]: {
    fontSize: '1.5rem'
  },

  [theme.breakpoints.up('desktop')]: {
    fontSize: '1.875rem'
  },

  ...theme.createStyles('dark', {
    color: theme.colors.text.secondary.dark,
  }),
}));

const ButtonWrapper = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.up('mobile')]: {
    justifyContent: 'flex-start',
  }
}));

const ImageContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  float: 'right',
  marginTop: theme.spacing(8),
  textAlign: 'right',

  [theme.breakpoints.up('mobile')]: {
    width: '66.666667%',
    marginTop: 0
  }
}));

const HeroImage = styled.img({
  width: '100%',
  objectFit: 'cover'
});
