"use client"

import { ProjectsButtonFilters } from "@/components/reusable/buttonFilters"
import { useProjectsWithPagination } from "@/contexts/projectsContext"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { IProject, IProjectsTableAdminFilter } from "@/types/IProject"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { ChangeEventHandler, useEffect, useState } from "react"

const PAGE_PARAM_NAME = 'page'
const maxItemsPerPage = 6

export function ProjectsShowcase({ showAll = false }: { showAll?: boolean }) {
  const t = useTranslations("ProjectsShowcase")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [filter, setFilter] = useState<IProjectsTableAdminFilter>({
    q: '',
    published: true,
  })
  
  const [page, setPage] = useState(() => {
    const cPage = Number(searchParams.get(PAGE_PARAM_NAME) ?? '1')
    if(isNaN(cPage) || cPage <= 0) return 1
    return cPage
  })

  const {
    data: projects,
    total,
    totalPage,
    startNum,
    lastNum,
  } = useProjectsWithPagination({
    page,
    perPage: maxItemsPerPage,
    filter,
  })

  useEffect(() => {
    if(!showAll) return;
    const sp = new URLSearchParams(searchParams)
    sp.set(PAGE_PARAM_NAME, page.toString())
    if(page > totalPage) {
      setPage(totalPage)
      return;
    }
    router.replace(`${pathname}?${sp.toString()}`)
  },[page,totalPage,showAll])

  return (
    <section className="w-full py-5 sm:py-10 mt-5 sm:mt-10">
      <div
        className="text-center font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light"
      >
        {t('title')}
      </div>
      <div className="mt-10 sm:mt-16">
        <h3 className="font-general-regular 
                       text-center text-secondary-dark
                       dark:text-ternary-light
                       text-md
                       sm:text-xl
                       mb-3"
        >
          {t('search_by_helper')}
        </h3>
        <div className="flex
                        justify-between
                        border-b border-primary-light
                        dark:border-secondary-dark
                        pb-3
                        gap-3"
        >
          <label className="flex justify-between gap-2">
            <span className="
                            hidden
                            sm:block
                            bg-primary-light
                            dark:bg-ternary-dark
                            p-2.5
                            shadow-sm
                            rounded-xl
                            cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-ternary-dark dark:text-ternary-light w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              value={filter.q}
              onChange={(e) => {
                setFilter(old => ({
                  ...old,
                  q: e.target.value,
                }))
              }}
              className="
                font-general-medium 
                pl-3
                pr-1
                sm:px-4
                py-2
                border 
                border-gray-200
                dark:border-secondary-dark
                rounded-lg
                text-sm
                sm:text-md
                bg-secondary-light
                dark:bg-ternary-dark
                text-primary-dark
                dark:text-ternary-light
              "
							id="search-project"
							name="search-project"
							type="search"
							placeholder={t('search_projects')}
							aria-label={t('search_projects')}
            />
          </label>
          <ProjectsButtonFilters
            filter={filter}
            onChangeFilter={(_filter) => setFilter(old => ({
              ...old,
              tags: _filter.tags,
            }))}
            labels={{
              tags: t('filters.tags'),
              button(filter) {
                if(!filter.tags?.length) return t('filters.buttons.no_filter')
                return t('filters.buttons.tag_filtered', { count: filter.tags.length })
              },
            }}
          />
        </div>
      </div>
      {projects.length == 0 ? <>
        <div className="text-center p-2 py-10 text-primary-dark dark:text-ternary-light">
          {t('empty_projects')}
        </div>
      </> : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-10">
        {projects.map(project => <ProjectCard key={project.project_id} project={project}/>)}
      </div>
      )}
    </section>
  )
}

function ProjectCard({ project }: { project: IProject }) {
  return (
    <Link href={`/projects/${project.project_id}`} aria-label="Project"
      className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark"
    >
      {/* Image */}
      <div className="relative pt-[56.25%] overflow-hidden">
        <img
          src={project.project_preview}
          alt={`${project.project_title} image`}
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500 object-top"
        />
      </div>
      {/* Content */}
      <div className="px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {project.project_tags.map(tag => (
            <span 
              key={tag.tag_name}
              className="inline-block px-2.5 py-0.5 bg-gray-300 dark:bg-gray-600 rounded-full text-xs text-gray-700 dark:text-gray-200"
            >
              {tag.tag_name}
            </span>
          ))}
        </div>
        <h3 className="font-general-medium text-lg md:text-xl text-bold text-ternary-dark dark:text-ternary-light mt-1">{project.project_title}</h3>
        <p className="text-ternary-dark dark:text-ternary-light mt-2 text-sm line-clamp-3 whitespace-pre-line">{project.project_desc}</p>
      </div>
    </Link>
  )
}