import { Image } from "@/components/image/image";
import { useDataContext } from "@/contexts/dataContext";
import { useDebounce } from "@/hooks/debouncedValue";
import { useTableData } from "@/hooks/tableData";
import { Link } from "@/i18n/routing";
import { ArrayOrder } from "@/lib/array";
import { hexAlpha } from "@/lib/colors";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { IProject, IProjectFilter, IProjectSortableProperties } from "@/types/IProject";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { filterProjects } from "@/utils/project";
import styled from '@emotion/styled';
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const PAGE_SIZE = 6;

type Props = {
  filter?: IProjectFilter;
  maxItems?: number;
  orderBy?: IProjectSortableProperties;
  orderMode?: ArrayOrder;

  alwaysShowDetails?: boolean;
}

export function GridProjects({ filter = {}, maxItems = 0, orderBy = 'updatedAt', orderMode = 'desc', alwaysShowDetails = false }: Props) {
  const t = useTranslations('GridProjects');
  const { getLinkHref } = useTemplatePageRouter();
  const { data: { projects } } = useDataContext();

  const filteredProjects = useMemo(() => filterProjects(projects, filter), [projects, filter]);

  const {
    handlePageChange,
    page,

    data,
    isLoading: dataIsLoading,
    total,
  } = useTableData<IProject, IProjectSortableProperties>({
    data: filteredProjects,
    pageSize: PAGE_SIZE,
    orderBy,
    order: orderMode,
  });

  const isLoading = useDebounce(dataIsLoading, 300);

  const showPagination = !maxItems;

  const dataToRender = useMemo(() => (maxItems > 0 ? data.slice(0, maxItems) : data), [maxItems, data]);

  if (isLoading) {
    return (
      <GridContainer>
        {Array.from({ length: maxItems > 0 ? maxItems : PAGE_SIZE }, (_, i) => (
          <GridCard key={i} href="#">
            <div style={{ minWidth: 300, minHeight: 300 }}></div>
          </GridCard>
        ))}
      </GridContainer>
    );
  }

  if (!data.length) {
    return <EmptyContainer>{t('empty_text')}</EmptyContainer>;
  }

  return (
    <GridContainer>
      {dataToRender.map(project => (
        <GridCard key={project.id} href={getLinkHref('project', { id: project.id })}>
          <Image src={project.previews[0]} sx={{ minWidth: 300, minHeight: 300 }} />
          <div
            className={[
              "details",
              alwaysShowDetails ? 'always-open' : '',
            ].join(' ')}
          >
            <span>{project.title}</span>
            <div className="tags-container">{project.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}</div>
          </div>
        </GridCard>
      ))}
      {/**TODO - pagination */}
    </GridContainer>
  );
}

// ===========================================================================

const EmptyContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'block',
  width: '100%',
  padding: theme.spacing(5),
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 500,
  opacity: 0.5,

  [theme.breakpoints.up('mobile')]: {
    padding: theme.spacing(10),
  },
  [theme.breakpoints.up('desktop')]: {
    padding: theme.spacing(15),
  },
}));

const GridContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(8),

  [theme.breakpoints.up('mobile')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(10),
  },
  [theme.breakpoints.up('desktop')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

const GridCard = styled(Link)<{ theme?: TemplateTheme }>(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',

  display: 'block',
  width: '100%',
  backgroundColor: theme.colors.background.paper.light,
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: theme.shadows(3),
  transition: 'all 100ms',

  position: 'relative',
  ['.details']: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    backgroundColor: hexAlpha(theme.colors.background.default.light, 0.5),
    backdropFilter: 'blur(5px)',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(3),
    ['&:not(.always-open)']: {
      position: 'absolute',
      transform: 'translateY(100%)',
    },
    transition: 'transform 300ms',
    transitionDelay: '500ms', // delay 0.5 second to close after mouse leave
    fontWeight: 900,
    textAlign: 'center',

    ['.tags-container']: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      ['span']: {
        display: 'inline-block',
        padding: '0 0.5em',
        lineHeight: 1.5,
        fontSize: '0.8em',
        fontWeight: 'normal',
        backgroundColor: hexAlpha('#000', 0.05),
        borderRadius: 99999,
        ...theme.createStyles('dark', {
          backgroundColor: hexAlpha('#fff', 0.05),
        }),
      },
    }
  },

  ['&:hover']: {
    boxShadow: theme.shadows(5),
    scale: 1.025,
    ['.details:not(.always-open)']: {
      transform: 'translateY(0)',
      transitionDelay: '0s', // no delay to open on mouse enter
    },
  },

  ...theme.createStyles('dark', {
    backgroundColor: theme.colors.background.paper.dark,
    ['.details']: {
      backgroundColor: hexAlpha(theme.colors.background.default.dark, 0.5),
    }
  }),
}));