import { useProjectTags } from "@/contexts/projectsContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IProjectsTableAdminFilter } from "../projectsTableAdmin";

type FilterType = Pick<IProjectsTableAdminFilter,'tags'>

type Props = {
  className?: string
  filter?: FilterType
  onChangeFilter?: (filter: FilterType) => void
}
export function TableAdminButtonFilters({
  className = '',
  filter,
  onChangeFilter = () => {},
}: Props) {
  const tags = useProjectTags()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const toggleOpen = useCallback(() => setOpen(old => !old),[setOpen])

  const [selected, _setSelected] = useState<string[]>(filter?.tags?.map(({ tag_name }) => tag_name) ?? [])
  const isSelected = useCallback((tag: string) => selected.findIndex(s => s == tag) != -1,[selected])
  const setSelected = useCallback((tag: string, isSelected: boolean) => _setSelected(old => {
    const newSelected = [
      ...old,
    ]
    const existId = newSelected.findIndex(s => s == tag)
    if(isSelected && existId == -1) {
      newSelected.push(tag)
    }else if(!isSelected && existId != -1) {
      newSelected.splice(existId, 1)
    } 
    
    return newSelected
  }),[_setSelected])

  useEffect(() => {
    if(!buttonRef.current || !dropdownRef.current) return;
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()

    if(open) {
      dropdownRef.current.style.top = `${buttonRect.bottom}px`
      dropdownRef.current.style.left = `${buttonRect.right - dropdownRect.width}px`

      const closeDropdown = () => setOpen(false)
      window.document.addEventListener('click', closeDropdown)

      return () => window.document.removeEventListener('click', closeDropdown)
    }
  },[open,setOpen])

  useEffect(() => {
    onChangeFilter({
      tags: selected.map(tag_name => ({ tag_name })),
    })
  },[selected])


  return <>
    <button
      ref={buttonRef}
      className={[
        "w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
        className,
      ].join(' ')}
      type="button"
      onClick={toggleOpen}
    >
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
      </svg>
      {selected.length > 0 ? `Filtered (${selected.length == 1 ? 'a tag' : selected.length + ' tags'})` : 'Filter'}
      <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </button>
    {open && createPortal(<div
      onClick={(e) => e.stopPropagation()} // prevent closed on click inside 
      ref={dropdownRef}
      className={[
        "absolute mt-2",
        "z-10 w-56 p-3 bg-white rounded-lg border divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600",
      ].join(' ')}
      role="menu"
    >
      <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Tags</h6>
      <ul className="space-y-2 pt-2 text-sm">
        {tags.map((tag, idx) => <li key={`filter-tags-${idx}`} className="flex items-center">
          <input
            id={`filter.tags.${idx}`}
            type="checkbox"
            checked={isSelected(tag.tag_name)}
            onChange={(e) => setSelected(tag.tag_name, e.target.checked)}
            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label
            htmlFor={`filter.tags.${idx}`}
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
          >{tag.tag_name}</label>
        </li>)}
      </ul>
    </div>, document.body)}
  </>
}