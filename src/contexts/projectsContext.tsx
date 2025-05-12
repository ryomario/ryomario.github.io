"use client"

import { IProject, IProjectsTableAdminFilter } from "@/types/IProject";
import { filterProjects } from "@/utils/project";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IProject[]
  tags: IProject['project_tags']
  tech: IProject['project_tech']
  update: (data: IProject[],tags: IProject['project_tags'],tech: IProject['project_tech']) => void
}>({
  data: [],
  tags: [],
  tech: [],
  update: () => {},
})

type Props = {
  data?: IProject[]
  tags?: IProject['project_tags']
  tech?: IProject['project_tech']
} & PropsWithChildren

export function ProjectsProvider({ children, data = [], tags = [], tech = [], }: Props) {
  const [_data, _setData] = useState<IProject[]>(data)
  const [_tags, _setTags] = useState<IProject['project_tags']>(tags)
  const [_tech, _setTech] = useState<IProject['project_tech']>(tech)

  const update = useCallback((value: IProject[],tags: IProject['project_tags'],tech: IProject['project_tech']) => {
    _setData(value)
    _setTags(tags)
    _setTech(tech)
  },[_setData,_setTags,_setTech])

  const value = useMemo(() => ({
    data: _data,
    tags: _tags,
    tech: _tech,
    update,
  }),[update,_data,_tags,_tech])
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useProjects = (filter: IProjectsTableAdminFilter = {}) => {
  const { data } = useContext(Context)
  return filterProjects(data, filter)
}
export const useProjectsWithPagination = ({
  page = 1,
  perPage = 10,
  filter = {},
}: {
  page?: number
  perPage?: number
  filter?: IProjectsTableAdminFilter
}) => {
  const { data } = useContext(Context)
  const filteredData = filterProjects(data, filter)
  const total = filteredData.length
  const totalPage = !total ? 1 : Math.ceil(total / perPage)
  const startIdx = perPage * (page - 1)
  const endIdx = startIdx + perPage
  const paginatedData = filteredData.slice(startIdx, endIdx)

  return {
    total,
    totalPage,
    data: paginatedData,
    startNum: !total ? 0 : startIdx + 1,
    lastNum: startIdx + paginatedData.length,
  }
}
export const useProjectTags = () => {
  const { tags } = useContext(Context)
  return tags
}
export const useProjectTech = () => {
  const { tech } = useContext(Context)
  return tech
}
export const useUpdateProjects = () => {
  const { update } = useContext(Context)
  return update
}