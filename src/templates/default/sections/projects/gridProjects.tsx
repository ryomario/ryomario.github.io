import { Image } from "@/components/image/image";
import { useDataContext } from "@/contexts/dataContext";
import { useDebounce } from "@/hooks/debouncedValue";
import { useTableData } from "@/hooks/tableData";
import { Link } from "@/i18n/routing";
import { ArrayOrder } from "@/lib/array";
import { adjustColorBrightness, getContrastTextColor, hexAlpha } from "@/lib/colors";
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
    pageSize,

    data,
    isLoading: dataIsLoading,
    total,
  } = useTableData<IProject, IProjectSortableProperties>({
    data: filteredProjects,
    pageSize: PAGE_SIZE,
    orderBy,
    order: orderMode,
  });

  const totalPage = !total ? 1 : Math.ceil(total / pageSize);

  const isLoading = useDebounce(dataIsLoading, 300);

  const showPagination = !maxItems && totalPage > 1;

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
          <Image src={project.previews[0]} ratio="1/1" />
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

      {showPagination && (
        <PaginationContainer>
          <ul>
            <li>
              <NavigationButton
                onClick={(e) => handlePageChange(e, page - 1)}
                disabled={page === 0}
              >{t('pagination.prev')}</NavigationButton>
            </li>
            {Array.from({ length: totalPage }, (_, i) => (
              <li key={i}>
                <PaginationPageButton
                  isActive={page === i}
                  onClick={(e) => handlePageChange(e, i)}
                >
                  {i + 1}
                </PaginationPageButton>
              </li>
            ))}
            <li>
              <NavigationButton
                onClick={(e) => handlePageChange(e, page + 1)}
                disabled={page === (totalPage - 1)}
              >{t('pagination.next')}</NavigationButton>
            </li>
          </ul>
        </PaginationContainer>
      )}
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

// ============== PAGINATION STYLES ====================
const PaginationContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(4),
  gridColumn: '1 / -1',
  ['ul']: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
    ['li']: {
      display: 'block',
    },
  },
}));

const PaginationPageButton = styled.button<{ isActive?: boolean, theme?: TemplateTheme }>(({ theme, isActive }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.colors.text.disabled.light}`,
  backgroundColor: isActive ? theme.colors.primary.light : 'transparent',
  color: isActive ? getContrastTextColor(theme.colors.primary.light) : theme.colors.text.primary.light,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  minWidth: '2.5rem',

  '&:not(:disabled):hover': {
    backgroundColor: isActive 
      ? adjustColorBrightness(theme.colors.primary.light, -10)
      : theme.colors.background.paper.light,
  },

  ...theme.createStyles('dark', {
    borderColor: theme.colors.text.disabled.dark,
    backgroundColor: isActive ? theme.colors.primary.dark : theme.colors.background.paper.dark,
    color: isActive ? getContrastTextColor(theme.colors.primary.dark) : theme.colors.text.secondary.dark,

    '&:not(:disabled):hover': {
      backgroundColor: isActive 
        ? adjustColorBrightness(theme.colors.primary.dark, 10)
        : adjustColorBrightness(theme.colors.background.paper.dark, 10)
    }
  }),

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const NavigationButton = styled(PaginationPageButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`
}));
