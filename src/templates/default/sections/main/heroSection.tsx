import { useTranslations } from "next-intl";
import ilustration from "./illustration.svg";
import { ButtonDownloadCV } from "./buttonDownloadCV";
import { useDataContext } from "@/contexts/dataContext";
import { styled } from "@mui/material/styles";

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
    </HeroContainer>
  );
}

// ============================================================================

const HeroContainer = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(4),

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(2),
  },
}));

const TextContainer = styled('div')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',

  [theme.breakpoints.up('md')]: {
    width: '33.333333%',
    textAlign: 'left',
  },
}));

const Heading = styled('h1')(({ theme }) => ({
  fontSize: '1.5rem',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  textAlign: 'center',

  [theme.breakpoints.up('sm')]: {
    textAlign: 'left',
  },

  [theme.breakpoints.up('md')]: {
    fontSize: '1.875rem',
  },

  [theme.breakpoints.up('lg')]: {
    fontSize: '2.25rem',
  },
}));

const Subheading = styled('p')(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',

  [theme.breakpoints.up('sm')]: {
    textAlign: 'left',
    fontSize: '1.25rem'
  },

  [theme.breakpoints.up('md')]: {
    fontSize: '1.5rem'
  },

  [theme.breakpoints.up('lg')]: {
    fontSize: '1.875rem'
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-start',
  }
}));

const ImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  float: 'right',
  marginTop: theme.spacing(2),
  textAlign: 'right',

  [theme.breakpoints.up('sm')]: {
    width: '66.666667%',
    marginTop: 0,
  },
}));

const HeroImage = styled('img')({
  width: '100%',
  objectFit: 'cover',
});
