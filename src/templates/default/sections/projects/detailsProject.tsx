import { NotFoundComponent } from "@/components/notFound";
import { GalleryHorizontalScroll } from "@/components/reusable/images/galleryHorizontalScroll";
import { useDataProject } from "@/contexts/dataContext";
import { Locale } from "@/i18n/routing";
import { date2localeString } from "@/lib/date";
import { fileData } from "@/lib/file";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useLocale, useTranslations } from "next-intl";
import Link from "@mui/material/Link";

import {
  AccessTime,
  Code as CodeIcon,
  Link as LinkIcon,
  SellOutlined
} from '@mui/icons-material';
import { GridProjects } from "./gridProjects";

type Props = {
  projectId: number;
}

export function DetailsProject({ projectId }: Props) {
  const locale = useLocale();
  const t = useTranslations('ProjectsSection');
  const project = useDataProject(projectId);

  if(!project) {
    return <NotFoundComponent homeUrl={`/${locale}`}/>
  }

  return (
    <>
      <SectionHeader>{project.title}</SectionHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <SubHeaderItem sx={(theme) => ({ marginRight: theme.spacing(5)})}>
          <AccessTime fontSize="inherit"/>
          <span>{date2localeString(project.updatedAt, false, locale as Locale)}</span>
        </SubHeaderItem>
        <SubHeaderItem>
          <SellOutlined fontSize="inherit"/>
          <span>{project.tags.join(', ')}</span>
        </SubHeaderItem>
      </div>
      <GalleryHorizontalScroll
        sx={{ marginTop: 4 }}
        images={project.previews.map(preview => fileData(preview).path ?? '')}
      />

      <Grid container columns={3} sx={{ width: '100%', mt: 4 }} spacing={2}>
        <Grid size={{ xs: 3, md: 1 }}>
          <Stack spacing={2}>
            <Typography variant="h4">{t('detailsLabels.details')}</Typography>
            <Stack>
              <Typography variant="body1">{t('detailsLabels.created_at')}</Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <AccessTime fontSize="small"/>
                <Typography variant="caption">{date2localeString(project.createdAt, false, locale as Locale)}</Typography>
              </Stack>
            </Stack>
            {(
              project.link_demo && project.link_demo.trim() != ''
            ) && (
              <Stack>
                <Typography variant="body1">{t('detailsLabels.demo')}</Typography>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LinkIcon fontSize="small"/>
                  <Typography component={Link} href={project.link_demo} target="_blank" color="inherit" variant="caption">{project.link_demo}</Typography>
                </Stack>
              </Stack>
            )}
            {(
              project.link_repo && project.link_repo.trim() != ''
            ) && (
              <Stack>
                <Typography variant="body1">{t('detailsLabels.source_code')}</Typography>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <CodeIcon fontSize="small"/>
                  <Typography component={Link} href={project.link_repo} target="_blank" color="inherit" variant="caption">{project.link_repo}</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid size={{ xs: 3, md: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h4">{t('detailsLabels.description')}</Typography>
            <Stack spacing={1}>
              {project.desc.split('\n').map((paragraph, i) => (
                <Typography key={i} variant="body2">{paragraph}</Typography>
              ))}
            </Stack>
          </Stack>
        </Grid>
        <Grid size={3} sx={{ mt: 8 }}>
          <Stack spacing={5}>
            <Typography variant="h4">{t('detailsLabels.related_projects')}</Typography>
            <GridProjects hide={[project.id]} filter={{ published: true, tags: project.tags }} maxItems={4} smallPreview/>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

// =========================================================================

const SectionHeader = styled('h1')(({ theme }) => ({
  all: 'unset',

  width: '100%',
  fontSize: '1.875rem',
  textAlign: 'left',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));
const SubHeaderItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  color: theme.palette.text.primary,
  marginTop: theme.spacing(2),

  ['svg']: {
    width: '1em',
    height: '1em',
    flexShrink: 0,
  },
  ['span']: {
    marginLeft: theme.spacing(1.5),
    lineHeight: 1,
  },
}));