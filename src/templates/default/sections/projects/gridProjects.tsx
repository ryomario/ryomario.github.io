import { Image } from "@/components/image/image";
import { useDataContext } from "@/contexts/dataContext";
import { useDebounce } from "@/hooks/debouncedValue";
import { useTableData } from "@/hooks/tableData";
import { Link } from "@/i18n/routing";
import { ArrayOrder } from "@/lib/array";
import { useTemplatePageRouter } from "@/templates/hooks/templatePageRouter";
import { IProject, IProjectFilter, IProjectSortableProperties } from "@/types/IProject";
import { filterProjects } from "@/utils/project";
import { alpha, darken, styled } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const PAGE_SIZE = 6;

type Props = {
  filter?: IProjectFilter;
  /**
   * default to `0`, means that pagination will be shown
   */
  maxItems?: number;
  /**
   * default to `updatedAt`
   */
  orderBy?: IProjectSortableProperties;
  /**
   * default to `desc`
   */
  orderMode?: ArrayOrder;

  /**
   * must be static, can not be dynamic or changed programmaticaly
   */
  hide?: IProject['id'][];

  /**
   * default to `false`
   */
  alwaysShowDetails?: boolean;
  /**
   * default to `false`
   */
  smallPreview?: boolean;
}

export function GridProjects({ hide = [], filter = {}, maxItems = 0, orderBy = 'updatedAt', orderMode = 'desc', alwaysShowDetails = false, smallPreview = false }: Props) {
  const t = useTranslations('GridProjects');
  const { getLinkHref } = useTemplatePageRouter();
  const { data: { projects } } = useDataContext();

  const filteredProjects = useMemo(() => filterProjects(projects.filter(({ id }) => !hide.includes(id)), filter), [projects, filter]);

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
      <GridContainer smallPreview={smallPreview}>
        {Array.from({ length: maxItems > 0 ? maxItems : PAGE_SIZE }, (_, i) => (
          <GridCard key={i} href="#">
            <div style={{ width: 'auto', aspectRatio: '1/1' }}></div>
          </GridCard>
        ))}
      </GridContainer>
    );
  }

  if (!data.length) {
    return <EmptyContainer>{t('empty_text')}</EmptyContainer>;
  }

  return (
    <GridContainer smallPreview={smallPreview}>
      {dataToRender.map(project => (
        <GridCard key={project.id} href={getLinkHref('projects', { id: project.id })}>
          <Image src={project.previews[0]} ratio="1/1" />
          <div
            className={[
              "details",
              alwaysShowDetails ? 'always-open' : '',
            ].join(' ')}
          >
            <span>{project.title}</span>
            {!smallPreview && <div className="tags-container">{project.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}</div>}
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

const EmptyContainer = styled('div')(({ theme }) => ({
  display: 'block',
  width: '100%',
  padding: theme.spacing(3),
  textAlign: 'center',
  fontSize: '1.2rem',
  fontWeight: 500,
  opacity: 0.5,

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(8),
  },
}));

const GridContainer = styled('div')<{ smallPreview?: boolean }>(({ theme, smallPreview }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${smallPreview ? 2 : 1}, 1fr)`,
  gap: theme.spacing(3),
  fontSize: smallPreview ? '0.75rem' : '1.2rem',

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: `repeat(${smallPreview ? 4 : 2}, 1fr)`,
    gap: theme.spacing(5),
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: `repeat(${smallPreview ? 6 : 3}, 1fr)`,
  },
}));

const GridCard = styled(Link)(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',

  display: 'block',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '1em',
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  transition: 'all 100ms',

  position: 'relative',
  ['.details']: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    backdropFilter: 'blur(5px)',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0.5em',
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
      gap: '0.25em',
      ['span']: {
        display: 'inline-block',
        padding: '0 0.5em',
        lineHeight: 1.5,
        fontSize: '0.8em',
        fontWeight: 'normal',
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: 99999,
      },
    }
  },

  ['&:hover']: {
    boxShadow: theme.shadows[3],
    scale: 1.025,
    ['.details:not(.always-open)']: {
      transform: 'translateY(0)',
      transitionDelay: '0s', // no delay to open on mouse enter
    },
  },
}));

// ============== PAGINATION STYLES ====================
const PaginationContainer = styled('div')(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(2),
  gridColumn: '1 / -1',
  ['ul']: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    ['li']: {
      display: 'block',
    },
  },
}));

const PaginationPageButton = styled('button')<{ isActive?: boolean }>(({ theme, isActive }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.text.disabled}`,
  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  minWidth: '2.5rem',

  '&:not(:disabled):hover': {
    backgroundColor: isActive
      ? darken(theme.palette.primary.main, 0.1)
      : theme.palette.background.paper,
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const NavigationButton = styled(PaginationPageButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`
}));
