'use client';

import { useTranslations } from "next-intl";
import { GridProjects } from "./gridProjects";
import { useEffect, useState } from "react";
import { IProjectFilter } from "@/types/IProject";
import { useDebounce } from "@/hooks/debouncedValue";
import { ProjectsFilter } from "./projectsFilter";
import { alpha, styled } from "@mui/material/styles";

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

const SectionHeader = styled('h1')(({ theme }) => ({
  width: '100%',
  marginBlock: theme.spacing(2),
  textAlign: 'center',
  fontWeight: 500,

  [theme.breakpoints.up('sm')]: {
    marginBlock: theme.spacing(4),
  },
}));

const FilterHelper = styled('h3')(({ theme }) => ({
  marginBlock: theme.spacing(3),
  textAlign: 'center',
  fontWeight: 'normal',
  color: theme.palette.text.secondary,
}));

const FilterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  borderBottom: '2px solid',
  borderColor: theme.palette.divider,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(3.5),
  gap: theme.spacing(2),
}));

/** ============== Search Input ============== **/

const SearchContainer = styled('label')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),

  ['.icon-wrapper']: {
    display: 'none',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1.25),
    borderRadius: theme.spacing(1),
    cursor: 'pointer',

    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    ['svg']: {
      width: '1.25rem',
      height: '1.25rem',
    },
  },
  ['input']: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    border: '1px solid',
    borderColor: theme.palette.text.disabled,
    borderRadius: theme.spacing(1),
    fontSize: '0.875rem',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    outline: 'none',

    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      fontSize: '1rem',
    },

    ['&:focus']: {
      borderColor: alpha(theme.palette.primary.main, 0.5),
      outline: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    },
  },
}));