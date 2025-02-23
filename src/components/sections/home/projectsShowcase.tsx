"use client"

import { Project } from "@/data/projects"
import { useProjects } from "@/hooks/useProjects"
import { useProjectTags } from "@/hooks/useProjectTags"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ChangeEventHandler } from "react"

export function ProjectsShowcase({ maxItems }: { maxItems?: number }) {
  const t = useTranslations("ProjectsShowcase")

  const { projects, currentFilter, addFilter } = useProjects({
    q: '',
    limit: maxItems,
  })

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
              value={currentFilter.q}
              onChange={(e) => {
                addFilter({ q: e.target.value })
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
          <ProjectTagsSelect value={currentFilter.tags?.[0] ?? 'all'} onChange={(e) => {
            const tags = []
            if(e.target.value != 'all')tags.push(e.target.value)
            addFilter({ tags })
          }}/>
        </div>
      </div>
      {projects.length == 0 ? <>
        <div className="text-center p-2 py-10 text-primary-dark dark:text-ternary-light">
          {t('empty_projects')}
        </div>
      </> : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-10">
        {projects.map(project => <ProjectCard key={project.id} project={project}/>)}
      </div>
      )}
    </section>
  )
}

function ProjectTagsSelect({ value, onChange }: { value: string, onChange: ChangeEventHandler<HTMLSelectElement> }) {
  const t = useTranslations("ProjectsShowcase")

  const { tags, isLoading: isLoadingTags } = useProjectTags({
    q: '',
  })

  return (
    <select
      value={value}
      onChange={onChange}
      className="
        font-general-medium 
        px-4
        sm:px-6
        py-2
        border
        dark:border-secondary-dark
        rounded-lg
        text-sm
        sm:text-md
        dark:font-medium
        bg-secondary-light
        dark:bg-ternary-dark
        text-primary-dark
        dark:text-ternary-light
      "
      disabled={isLoadingTags}
    >
      <option className="text-sm sm:text-md" value={'all'}>{t('select_allProjects')}</option>
      {!isLoadingTags && tags.map(option => (
        <option className="text-sm sm:text-md" key={option}>{option}</option>
      ))}
    </select>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div>
      <Link href={`/projects/${project.id}`} aria-label="Project">
        <div className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark">
          <div>
            <img src={project.imgUrl} alt={`${project.title} image`} className="rounded-t-xl border-none aspect-[3/2] object-cover object-top" />
          </div>
          <div className="text-center px-4 py-6">
            <p className="font-general-medium text-lg md:text-xl text-ternary-dark dark:text-ternary-light mb-2 text-bold">
              {project.title}
            </p>
            <span className="text-lg text-ternary-dark dark:text-ternary-light">
              {project.tags.join(', ')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}