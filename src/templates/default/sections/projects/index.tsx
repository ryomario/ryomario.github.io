'use client';

import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import styled from '@emotion/styled';
import { useTranslations } from "next-intl";
import { GridProjects } from "./gridProjects";
import { useEffect, useState } from "react";
import { IProjectFilter } from "@/types/IProject";
import { hexAlpha } from "@/lib/colors";
import { useDebounce } from "@/hooks/debouncedValue";
import { ProjectsFilter } from "./projectsFilter";

export function ProjectsSection() {
  const t = useTranslations('ProjectsSection');

  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const [filter, setFilter] = useState<Required<IProjectFilter>>({ q: '', tags: [], published: true });

  useEffect(() => {
    setFilter(old => ({ ...old, q: debouncedQuery }));
  }, [debouncedQuery]);

  return (
    <>
      <SectionHeader>{t('heading')}</SectionHeader>
      <FilterHelper>{t('filter_helper')}</FilterHelper>
      <FilterContainer>
        <SearchContainer>
          <span className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            id="search-projects"
            name="search-projects"
            type="search"
            placeholder={t('search_projects')}
            aria-label={t('search_projects')}
          />
        </SearchContainer>
        <ProjectsFilter
          filter={filter}
          onChangeFilter={(newFilter) => setFilter(old => ({ ...old, ...newFilter }))}
        />
      </FilterContainer>
      <GridProjects
        filter={filter}
        alwaysShowDetails
      />
    </>
  );
}

// =========================================================================

const SectionHeader = styled.h1<{ theme?: TemplateTheme }>(({ theme }) => ({
  width: '100%',
  marginBlock: theme.spacing(10),
  textAlign: 'center',
  fontWeight: 500,

  [theme.breakpoints.up('mobile')]: {
    marginBlock: theme.spacing(15),
  },
}));

const FilterHelper = styled.h3<{ theme?: TemplateTheme }>(({ theme }) => ({
  marginBlock: theme.spacing(3),
  textAlign: 'center',
  fontWeight: 'normal',
  color: theme.colors.text.secondary.light,
  ...theme.createStyles('dark', {
    color: theme.colors.text.secondary.dark,
  }),
}));

const FilterContainer = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  borderBottom: '2px solid',
  borderColor: hexAlpha(theme.colors.text.disabled.light, 0.3),
  paddingBottom: theme.spacing(3),
  marginBottom: theme.spacing(5),
  gap: theme.spacing(3),
  ...theme.createStyles('dark', {
    borderColor: theme.colors.text.disabled.dark,
  }),
}));

/** ============== Search Input ============== **/

const SearchContainer = styled.label<{ theme?: TemplateTheme }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2),

  ['.icon-wrapper']: {
    display: 'none',
    color: theme.colors.text.secondary.light,
    backgroundColor: theme.colors.background.paper.light,
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(3),
    cursor: 'pointer',

    [theme.breakpoints.up('mobile')]: {
      display: 'flex',
    },

    ...theme.createStyles('dark', {
      color: theme.colors.text.secondary.dark,
      backgroundColor: theme.colors.background.paper.dark,
    }),

    ['svg']: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  },
  ['input']: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    border: '1px solid',
    borderColor: hexAlpha(theme.colors.text.disabled.light, 0.3),
    borderRadius: theme.spacing(2),
    fontSize: '0.875rem',
    backgroundColor: theme.colors.background.default.light,
    color: theme.colors.text.primary.light,
    width: '100%',
    outline: 'none',

    [theme.breakpoints.up('mobile')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      fontSize: '1rem',
    },

    ['&:focus']: {
      borderColor: hexAlpha(theme.colors.primary.light, 0.5),
      outline: `1px solid ${hexAlpha(theme.colors.primary.light, 0.5)}`,
    },

    ...theme.createStyles('dark', {
      borderColor: hexAlpha(theme.colors.text.disabled.dark, 0.3),
      backgroundColor: theme.colors.background.paper.dark,
      color: theme.colors.text.primary.dark,

      ['&:focus']: {
        borderColor: hexAlpha(theme.colors.primary.light, 0.5),
        outline: `1px solid ${hexAlpha(theme.colors.primary.light, 0.5)}`,
      },
    }),
  },
}));