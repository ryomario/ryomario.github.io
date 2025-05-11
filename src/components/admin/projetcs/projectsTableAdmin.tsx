"use client"

import { date2string } from "@/lib/date";
import { ProjectsTableAdminButtonActions } from "./tableAdmin/buttonActions";
import { TableAdminButtonToggleLayoutType } from "./tableAdmin/buttonToggleLayoutType";
import { TableAdminButtonFilters } from "./tableAdmin/buttonFilters";
import { TableAdminAddProject } from "./views/formAddProject";
import { useProjectsWithPagination } from "@/contexts/projectsContext";
import { useEffect, useState } from "react";
import { Pagination } from "./components/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IProject } from "@/types/IProject";
import cardStyles from "./styles/card.module.css";

export type IProjectsTableAdminFilter = {
  q: string
  tags?: IProject['project_tags']
}

const PAGE_PARAM_NAME = 'page'
const LAYOUT_PARAM_NAME = 'layout'

export function ProjectsTableAdmin() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [layout, setLayout] = useState<'grid'|'list'>(() => {
    const cLayout = searchParams.get(LAYOUT_PARAM_NAME) ?? 'grid'
    if(cLayout != 'grid' && cLayout != 'list') return 'grid'
    return cLayout
  })
  const [filter, setFilter] = useState<IProjectsTableAdminFilter>({
    q: ''
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
    perPage: 5,
    filter,
  })

  useEffect(() => {
    const sp = new URLSearchParams(searchParams)
    sp.set(PAGE_PARAM_NAME, page.toString())
    if(page > totalPage) {
      setPage(totalPage)
      return;
    }
    router.replace(`${pathname}?${sp.toString()}`)
  },[page,totalPage])

  useEffect(() => {
    const sp = new URLSearchParams(searchParams)
    sp.set(LAYOUT_PARAM_NAME, layout.toString())
    if(layout != 'grid' && layout != 'list') {
      setLayout('grid')
      return;
    }
    router.replace(`${pathname}?${sp.toString()}`)
  },[layout])

  return <>
    <div className="relative sm:rounded-lg overflow-hidden">
      {/* toolbar */}
      <div className="flex justify-end px-4 py-2">
        <TableAdminAddProject/>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <div className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                value={filter.q}
                onChange={(e) => setFilter(old => ({
                  ...old,
                  q: e.target.value,
                }))}
                type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search"/>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
                <TableAdminButtonToggleLayoutType layoutType={layout} onChange={setLayout}/>
                <TableAdminButtonFilters
                  filter={filter}
                  onChangeFilter={(_filter) => setFilter(old => ({
                    ...old,
                    tags: _filter.tags,
                  }))}
                />
            </div>
        </div>
      </div>
      {/* toolbar END */}
      {/* layout */}
      {layout == 'list' && <TableView projects={projects}/>}
      {layout == 'grid' && <GridView projects={projects}/>}
      {/* layout END */}
      {/* footer */}
      <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span className="font-semibold text-gray-900 dark:text-white">
            {` ${startNum} - ${lastNum} `}
          </span>
          of
          <span className="font-semibold text-gray-900 dark:text-white">
            {` ${total}`}
          </span>
        </span>
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPage}
          maxVisiblePages={3}
        />
      </nav>
      {/* footer END */}
    </div>
  </>
}

type ViewProps = {
  projects: IProject[]
}

function TableView({ projects }: ViewProps) {
  return <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-4 py-4">Project</th>
          <th scope="col" className="px-4 py-3">Tags</th>
          <th scope="col" className="px-4 py-3">Date Created</th>
          <th scope="col" className="px-4 py-3">Last Updated</th>
          <th scope="col" className="px-4 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {projects.length == 0 && <tr className="border-b dark:border-gray-700">
          <td colSpan={5} className="px-4 py-5 text-center">No Project</td>
        </tr>}
        {projects.map(project => <tr key={`${project.project_id}`} className="border-b dark:border-gray-700">
          <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{project.project_title}</th>
          <td className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {project.project_tags.map(tag => (
                <span 
                  key={tag.tag_name}
                  className="inline-block px-2.5 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700"
                >
                  {tag.tag_name}
                </span>
              ))}
            </div>
          </td>
          <td className="px-4 py-3">{date2string(project.createdAt,false)}</td>
          <td className="px-4 py-3">{date2string(project.updatedAt)}</td>
          <td className="px-4 py-3 flex items-center justify-end">
            <ProjectsTableAdminButtonActions project_id={project.project_id}/>
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>
}

function GridView({ projects }: ViewProps) {
  return <div className={`grid ${
    projects.length == 0
    ? 'grid-cols-1' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  } gap-6`}>
    {/* Grid */}
    {projects.length == 0 && <p className="px-4 py-5 text-center">No Project</p>}
    {projects.map((project) => (
      <div 
        key={project.project_id}
        className={`${cardStyles.card} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}
      >
        {/* Card header with Dropdown */}
        <div className="relative">
          {/* Image */}
          <div className="relative pt-[56.25%] overflow-hidden">
            <img
              src={project.project_preview} 
              alt={project.project_title} 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <span className={`absolute top-3 left-3 text-xs font-semibold uppercase px-2 py-1 rounded-full ${
              project.published 
                ? 'bg-green-200 text-green-800' 
                : 'bg-amber-200 text-amber-800'
            }`}>
              {project.published ? 'Published' : 'Draft'}
            </span>
          </div>
          {/* Dropdown toggle (Only shows on hover) */}
          <ProjectsTableAdminButtonActions
            project_id={project.project_id}
            className={`${cardStyles['card-actions']} absolute top-3 right-3 bg-white shadow`}
          />
        </div>
        {/* content */}
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {project.project_tags.map(tag => (
              <span 
                key={tag.tag_name}
                className="inline-block px-2.5 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">{project.project_title}</h3>
          <p className="text-gray-600 mt-2 text-sm line-clamp-3 whitespace-pre-line">{project.project_desc}</p>
        </div>
      </div>
    ))}
  </div>
}