"use client"

import { IProject } from "@/types/IProject";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

const Context = createContext<{
  data: IProject[]
  update: (data: IProject[]) => void
}>({
  data: [],
  update: () => {},
})

type Props = {
  data?: IProject[]
} & PropsWithChildren

export function ProjectsProvider({ children, data = [] }: Props) {
  const [_data, _setData] = useState<IProject[]>(data)

  const update = useCallback((value: IProject[]) => {
    _setData(value)
  },[_setData])

  const value = useMemo(() => ({
    data: _data,
    update,
  }),[update,_data])
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
}: {
  page?: number
  perPage?: number
}) => {
  const { data } = useContext(Context)
  const total = data.length
  const totalPage = Math.ceil(total / perPage)
  const startIdx = perPage * (page - 1)
  const endIdx = startIdx + perPage
  const paginatedData = data.slice(startIdx, endIdx)

  return {
    total,
    totalPage,
    data: paginatedData,
    startIdx,
    lastIdx: startIdx + (paginatedData.length - 1),
  }
}
export const useUpdateProjects = () => {
  const { update } = useContext(Context)
  return update
}