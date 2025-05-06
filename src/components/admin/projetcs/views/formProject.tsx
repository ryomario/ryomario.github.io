import { useState } from "react"
import { Modal } from "../components/modal"
import { useForm } from "react-hook-form"
import { IProject } from "@/types/IProject"
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { useUpdateProjects } from "@/contexts/projectsContext"

export function TableAdminAddProject() {
  const [open, setOpen] = useState(false)
  const updateProjects = useUpdateProjects()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<IProject>>()

  const onSave = handleSubmit(async (value: Partial<IProject>) => {
    console.log('save', value)
    const saved = await RepoProjects_server.save({
      project_title: value.project_title ?? '',
      project_desc: value.project_desc ?? '',
      project_preview: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      project_tags: [{ tag_name: 'Web' }],
      published: false,
    })
    console.log('saved', saved)
    if(saved) {
      updateProjects(await RepoProjects_server.getAll())
      setOpen(false)
      reset()
    }
  })

  return <>
    <button onClick={() => setOpen(true)} type="button" className="flex items-center justify-center text-white bg-gray-900 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
      <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
      </svg>
      Add project
    </button>

    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Add Project"
      actions={<>
        <button disabled={isSubmitting} onClick={onSave} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {isSubmitting ? 'Loading...' : 'Save'}
        </button>
        <button onClick={() => setOpen(false)} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
      </>}
    >
      <form onSubmit={onSave}>
        <div className="mb-3">
          <label htmlFor="project-title"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.project_title ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Project Title</label>
          <input
            id="project-title"
            type="text"
            className={[
              "border text-sm rounded-lg block w-full p-2.5",
              (errors.project_title ? 
                "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
              )
            ].join(' ')}
            placeholder="Project Title"
            {...register('project_title', { required: true })}
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label htmlFor="project-desc"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.project_desc ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Project Description</label>
          <textarea
            rows={4}
            id="project-desc"
            className={[
              "block border text-sm rounded-lg block w-full p-2.5",
              (errors.project_desc ? 
                "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
              )
            ].join(' ')}
            placeholder="Project Description"
            {...register('project_desc')}
          />
        </div>
      </form>
    </Modal>
  </>
}