import { useCallback, useState } from "react"

type LayoutType = 'grid'|'list'

type Props = {
  layoutType: LayoutType
  onChange?: (type: LayoutType) => void
}

export function TableAdminButtonToggleLayoutType({ layoutType = 'list', onChange: propOnChange }: Props) {
  const [type, setType] = useState<LayoutType>(layoutType)
  const handleChange = useCallback((type: LayoutType) => {
    setType(type)
    if(propOnChange)propOnChange(type)
  },[propOnChange, setType])

  return <div className="inline-flex rounded-md" role="group">
    <button
      type="button"
      onClick={() => handleChange('grid')}
      className={[
        "inline-flex items-center px-4 py-2 text-sm font-medium focus:outline-none rounded-s-lg border focus:z-10 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-700",
        (type == 'grid'
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        )
      ].join(' ')}
    >
      <svg className="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd"/>
      </svg>
    </button>
    <button
      type="button"
      onClick={() => handleChange('list')}
      className={[
        "inline-flex items-center px-4 py-2 text-sm font-medium focus:outline-none rounded-e-lg border focus:z-10 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-700",
        (type == 'list'
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        )
      ].join(' ')}
    >
      <svg className="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
      </svg>
    </button>
  </div>
}