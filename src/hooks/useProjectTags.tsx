"use client"

import { Project } from "@/data/projects"
import { searchStringContains } from "@/lib/strings"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

type Filter = {
  q: string
}

export function useProjectTags(initialFilter?: Filter): {
  tags: string[]
  isLoading: boolean
  currentFilter: Filter
  filterBy: (filter: Filter) => void
  addFilter: (filter: Partial<Filter>) => void
} {
  const locale = useLocale()
  const [data, setData] = useState<string[]>([])
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
      const { data } = await fetch(`/${locale}/api/projects/tags`).then(res => res.json())
      const filteredData = (data as string[]).filter((tag => {
        if(filter.q && filter.q.trim()) {
          if(!searchStringContains(tag, filter.q)) return false
        }
  
        return true
      }))

      return filteredData
    })().then((data) => {
      setData(data)
    }).catch(() => {
      setData([])
    }).finally(() => {
      setIsLoading(false)
    })
  },[filter, locale])

  return {
    tags: data,
    isLoading,
    currentFilter: filter,
    filterBy,
    addFilter,
  }
}