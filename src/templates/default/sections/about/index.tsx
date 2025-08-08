import { Image } from "@/components/image/image";
import { useDataContext } from "@/contexts/dataContext";
import { fileData } from "@/lib/file";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { ButtonDownloadCV } from "../main/buttonDownloadCV";

export function AboutSection() {
  const t = useTranslations('AboutSection');
  const { data: { profile } } = useDataContext();

  return (
    <Grid container sx={{ width: '100%' }} spacing={{ xs: 2, md: 5, lg: 10 }}>
      <Grid size={{ xs: 12, md: 4, lg: 6 }}>
        <Image
          src={fileData(profile.profile_picture).path}
          sx={{ width: '100%', borderRadius: '50%' }}
          ratio="1/1"
          slotProps={{
            overlay: { sx: (theme) => ({ zIndex: 1, backgroundImage: `radial-gradient(at 25% 25%, ${theme.palette.background.paper}, transparent)` }) },
            img: { sx: { zIndex: 2, position: 'absolute' } }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <SectionHeader>{t('heading')}</SectionHeader>
        <Typography variant="h6" fontWeight="normal">{profile.intro}</Typography>
        <ButtonDownloadCVWrpper>
          <ButtonDownloadCV />
        </ButtonDownloadCVWrpper>
      </Grid>
    </Grid>
  );
}

// =========================================================================

const SectionHeader = styled('h1')(({ theme }) => ({
  width: '100%',
  marginBlock: theme.spacing(2),
  fontSize: '2rem',
  textAlign: 'left',
  fontWeight: 500,

  [theme.breakpoints.up('sm')]: {
    marginBlock: theme.spacing(4),
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '3rem',
  },
}));

const ButtonDownloadCVWrpper = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  display: 'flex',

  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(4),
  },
}));