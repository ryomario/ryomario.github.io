import { useEffect, useMemo, useState } from "react"
import { ModalFormProject } from "../components/modalFormProject"
import { IProject } from "@/types/IProject"
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { SpinnerIcon } from "@/components/reusable/icons/spinnerIcon"

type Props = {
  project_id: IProject['project_id']
}

export function TableAdminEditProject({ project_id }: Props) {
  const [open, setOpen] = useState(false)
  const [project, setProject] = useState<IProject|null>(null)
  const opening = useMemo(() => open && !project,[open,project])
  
  useEffect(() => {
    if(open) {
      RepoProjects_server.getOne(project_id).then(data => {
        setProject(data)
      }).catch(() => setProject(null))
    } else {
      setProject(null)
    }
  },[project_id, open])

  return <>
    <button onClick={() => setOpen(true)} type="button"
      className={`flex w-full items-center py-2 px-4 text-gray-700 dark:text-gray-200 ${
        opening
        ? "bg-gray-100 dark:bg-gray-600 dark:text-white"
        : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      }`}
    >
      {opening ? <>
        <SpinnerIcon className="w-4 h-4 mr-2"/>
        Opening...
      </> : <>
        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        Edit
      </>}
    </button>

    {project && <>
      <ModalFormProject
        open={open && !opening}
        onClose={() => setOpen(false)}
        project={project}
      />
    </>}
  </>
}