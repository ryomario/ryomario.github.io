import { useState } from "react"
import { ModalFormProject } from "../components/modalFormProject"

export function TableAdminAddProject() {
  const [open, setOpen] = useState(false)

  return <>
    <button onClick={() => setOpen(true)} type="button" className="flex items-center justify-center text-white bg-gray-900 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
      <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
      </svg>
      Add project
    </button>

    <ModalFormProject
      open={open}
      onClose={() => setOpen(false)}
    />
  </>
}