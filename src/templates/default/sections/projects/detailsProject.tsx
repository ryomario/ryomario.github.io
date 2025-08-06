import { NotFoundComponent } from "@/components/notFound";
import { GalleryHorizontalScroll } from "@/components/reusable/images/galleryHorizontalScroll";
import { useDataProject } from "@/contexts/dataContext";
import { Locale } from "@/i18n/routing";
import { date2localeString } from "@/lib/date";
import { fileData } from "@/lib/file";
import { styled } from "@mui/material/styles";
import { useLocale } from "next-intl";

type Props = {
  projectId: number;
}

export function DetailsProject({ projectId }: Props) {
  const locale = useLocale();
  const project = useDataProject(projectId);

  if(!project) {
    return <NotFoundComponent homeUrl={`/${locale}`}/>
  }

  return (
    <>
      <SectionHeader>{project.title}</SectionHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <SubHeaderItem sx={(theme) => ({ marginRight: theme.spacing(5)})}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{date2localeString(project.updatedAt, false, locale as Locale)}</span>
        </SubHeaderItem>
        <SubHeaderItem>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <span>{project.tags.join(', ')}</span>
        </SubHeaderItem>
      </div>
      <GalleryHorizontalScroll images={project.previews.map(preview => fileData(preview).path ?? '')} />
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