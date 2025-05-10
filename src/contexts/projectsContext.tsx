"use client"

import { IProjectsTableAdminFilter } from "@/components/admin/projetcs/projectsTableAdmin";
import { IProject } from "@/types/IProject";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IProject[]
  tags: IProject['project_tags']
  update: (data: IProject[],tags: IProject['project_tags']) => void
}>({
  data: [],
  tags: [],
  update: () => {},
})

type Props = {
  data?: IProject[]
  tags?: IProject['project_tags']
} & PropsWithChildren

export function ProjectsProvider({ children, data = [], tags = [] }: Props) {
  const [_data, _setData] = useState<IProject[]>(data)
  const [_tags, _setTags] = useState<IProject['project_tags']>(tags)

  const update = useCallback((value: IProject[],tags: IProject['project_tags']) => {
    _setData(value)
    _setTags(tags)
  },[_setData,_setTags])

  const value = useMemo(() => ({
    data: _data,
    tags: _tags,
    update,
  }),[update,_data,_tags])
  return <Context.Provider value={value}>
    {children}
  </Context.Provider>
}

export const useProjects = () => {
  const { data } = useContext(Context)
  return data
}
export const useProjectsWithPagination = ({
  page = 1,
  perPage = 10,
  filter,
}: {
  page?: number
  perPage?: number
  filter?: IProjectsTableAdminFilter
}) => {
  const { data } = useContext(Context)
  const filteredData = data.filter(d => {
    if(filter?.tags && filter?.tags.length > 0) {
      if(d.project_tags.every(({tag_name}) => !filter.tags?.some(f => f.tag_name == tag_name))) return false // project_tags contains some tags filtered
    }
    if(filter?.q && filter?.q.trim() != '') {
      if(!d.project_title.match(new RegExp(filter.q,'gi'))) return false
    }
    return true
  })
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
export const useUpdateProjects = () => {
  const { update } = useContext(Context)
  return update
}