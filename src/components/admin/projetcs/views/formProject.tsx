import { useCallback, useEffect, useState } from "react"
import { Modal } from "../components/modal"
import { useForm } from "react-hook-form"
import { IProject } from "@/types/IProject"
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { useUpdateProjects } from "@/contexts/projectsContext"
import { InputProjectTags } from "../components/inputProjectTags"
import { UploadImagePreview } from "../components/uploadImagePreview"

export function TableAdminAddProject() {
  const [open, setOpen] = useState(false)
  const updateProjects = useUpdateProjects()
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm<Partial<IProject>>()

  const project_tags = watch('project_tags')
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(!file.type.startsWith("image/")) {
        setError('project_preview',{
          message: "The selected file is not an image",
          type: 'value'
        });
        setPreview(null)
        return;
      }
      setFile(file)
      // Create preview for images
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string)
      reader.onerror = () => setPreview(null)
      reader.readAsDataURL(file);
    }
  },[])

  const onSave = handleSubmit(async (value: Partial<IProject>) => {
    console.log('save', value)
    if(!file) {
      setError('project_preview', {
        type: 'required',
        message: 'Please choose an image preview',
      })
      return
    }

    let res_upload
    try {
      res_upload = await RepoProjects_server.uploadImagePreview(file);
    } catch(error) {
      setError('project_preview', {
        type: 'value',
        message: (error as Error).message ?? 'Upload error',
      })
      return
    }

    try {
      const saved = await RepoProjects_server.save({
        project_title: value.project_title ?? '',
        project_desc: value.project_desc ?? '',
        project_preview: res_upload.path,
        createdAt: new Date(),
        updatedAt: new Date(),
        project_tags: value.project_tags ?? [],
        published: value.published ?? false,
      })
      console.log('saved', saved)
      if(saved) {
        updateProjects(await RepoProjects_server.getAll())
        setOpen(false)
        reset()
      }
    } catch(error) {
      try {
        await RepoProjects_server.deleteFileUploadImagePreview(res_upload.path)
      } catch(error) {
        console.log((error as Error).message ?? 'Delete file upload error')
      }
      console.log((error as Error).message ?? 'Unknown error')
      return
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
          <div className="flex items-center">
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview Image :</p>
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-40 rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  </>
}