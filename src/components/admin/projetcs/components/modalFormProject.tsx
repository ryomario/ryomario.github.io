import { useUpdateProjects } from "@/contexts/projectsContext"
import { IProject } from "@/types/IProject"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { Modal } from "./modal"
import { InputProjectTags } from "./inputProjectTags"
import { InputImage } from "./inputImage"

type Props = {
  project?: IProject
  open?: boolean
  onClose?: () => void
}

export function ModalFormProject({
  project,
  open = false,
  onClose = () => {},
}: Props) {
  const isFormUpdate = useMemo(() => !!project,[project])
  const updateProjects = useUpdateProjects()
  const [file, setFile] = useState<File|null>(null)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<Partial<IProject>>({
    defaultValues: project ?? {},
  })
  const project_tags = watch('project_tags')
  const project_preview = watch('project_preview')
  
  useEffect(() => {
    if(file) clearErrors('project_preview')
  },[file])

  const onSave = handleSubmit(async (value: Partial<IProject>) => {
    if(!isFormUpdate && !file) {
      setError('project_preview', {
        type: 'required',
        message: 'Please choose an image preview',
      })
      return
    }

    let res_upload
    try {
      if(!file) {
        if(isFormUpdate) {
          if(!value.project_preview) {
            throw Error('Please choose an image preview')
          }
          res_upload = {
            success: true,
            path: value.project_preview,
          }
        } else {
          throw Error('Please choose an image preview')
        }
      } else {
        res_upload = await RepoProjects_server.uploadImagePreview(file);
      }

    } catch(error) {
      setError('project_preview', {
        type: 'value',
        message: (error as Error).message ?? 'Upload error',
      })
      return
    }

    try {
      const new_project: Omit<IProject,'project_id'> = {
        project_title: value.project_title ?? '',
        project_desc: value.project_desc ?? '',
        project_preview: res_upload.path,
        createdAt: new Date(),
        updatedAt: new Date(),
        project_tags: value.project_tags ?? [],
        published: value.published ?? false,
      }

      let saved
      if(isFormUpdate) {
        saved = await RepoProjects_server.update(project?.project_id!!,new_project)
      } else {
        saved = await RepoProjects_server.save(new_project)

      }
      console.log('saved', saved)
      if(saved) {
        updateProjects(await RepoProjects_server.getAll())
        onClose()
        reset()
      }
    } catch(error) {
      try {
        if(file) {
          await RepoProjects_server.deleteFileUploadImagePreview(res_upload.path)
        }
      } catch(error) {
        console.log((error as Error).message ?? 'Delete file upload error')
      }
      console.log((error as Error).message ?? 'Unknown error')
      return
    }
  })

  useEffect(() => {
    setFile(null)
    reset()
  },[open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Project"
      actions={<>
        <button disabled={isSubmitting} onClick={onSave} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {isSubmitting ? 'Loading...' : 'Save'}
        </button>
        <button onClick={onClose} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
      </>}
    >
      <form onSubmit={onSave}>
        <div className="mb-3">
          <label htmlFor="project-title"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.project_title ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Project Title *</label>
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
        <div className="mb-3">
          <label htmlFor="published"
            className={[
              "inline-flex items-center text-sm font-medium",
              (errors.published ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}
          >
            <input
              id="published"
              type="checkbox"
              className={[
                "h-4 w-4 rounded",
                (errors.published ? 
                  "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                )
              ].join(' ')}
              {...register('published')}
            />
             <span className="ml-2 text-sm text-gray-700">Published</span>
          </label>
        </div>
        <InputProjectTags
          tags={project_tags}
          onChange={(tags) => setValue('project_tags', tags)}
        />
        <div className="mb-3">
          <label htmlFor="image_file"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.project_preview ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}
          >
            Project Preview
          </label>
          <InputImage onImageChange={setFile} initialValue={project_preview}/>
          {errors.project_preview && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.project_preview.message}</p>}
        </div>
      </form>
    </Modal>
  )
}