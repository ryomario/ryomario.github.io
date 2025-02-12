"use client"

import { Project, projectsData } from "@/data/projects"
import { searchStringContains } from "@/lib/strings"
import { useEffect, useState } from "react"

type Filter = {
  tags?: string[]
  dateStart?: Date
  dateEnd?: Date
  q: string
  limit?: number
}

export function useProjects(initialFilter?: Filter): {
  projects: Project[]
  isLoading: boolean
  currentFilter: Filter
  filterBy: (filter: Filter) => void
  addFilter: (filter: Partial<Filter>) => void
} {
  const [data, setData] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>(initialFilter ?? { q: '' })

  const filterBy = (filter: Filter) => {
    setFilter(filter)
  }
  
  const addFilter = (filter: Partial<Filter>) => {
    setFilter(oldFilter => ({
      ...oldFilter,
      ...filter,
    }))
  }



  useEffect(() => {
    setIsLoading(true);
    (async function(){
      const filteredData = projectsData.filter((project => {
        if(filter.tags && !filter.tags.every(tag => project.tags.includes(tag))) return false
        if(filter.dateStart && project.dateCreated.getTime() < filter.dateStart.getTime()) return false
        if(filter.dateEnd && project.dateCreated.getTime() > filter.dateEnd.getTime()) return false
  
        if(filter.q && filter.q.trim()) {
          if(!searchStringContains(project.title, filter.q)) return false
        }
  
        return true
      }))
      const limitedDate = filteredData.slice(0,filter.limit ? filter.limit : filteredData.length)

      return limitedDate
    })().then((data) => {
      setData(data)
    }).catch(() => {
      setData([])
    }).finally(() => {
      setIsLoading(false)
    })
  },[filter])

  return {
    projects: data,
    isLoading,
    currentFilter: filter,
    filterBy,
    addFilter,
  }
}