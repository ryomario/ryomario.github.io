import { IProject } from "@/types/IProject"
import { InputProjectTags } from "./inputProjectTags"
import { InputProjectTechs } from "./inputProjectTechs"
import { useInputProjectHook } from "../hooks/inputProjectHooks"
import { InputImages } from "./inputs/inputImage/inputImages"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useState } from "react"
import { Locale } from "@/i18n/routing"
import { LanguageSwitcherRadioInput } from "@/components/reusable/inputs/languageSwitcherRadioInput"

type Props = {
  project?: IProject
  onSaved?: () => void
}

export function FormInputProject({
  project,
  onSaved,
}: Props) {
  const [lang, setLang] = useState<Locale>('en')

  const {
    onSave,
    errors,
    register,
    watch,
    setValue,
    handleChangeImages,
    isSaving,
  } = useInputProjectHook(project)
  
  const project_tags = watch('project_tags')
  const project_tech = watch('project_tech')
  const project_preview = watch('project_preview')

  const handleSave = async () => {
    await onSave()
    onSaved?.()
  }

  return (
    <div>
      <div className="mb-3 w-full flex justify-end p-1">
        <LanguageSwitcherRadioInput
          lang={lang}
          disabled={isSaving}
          onChange={setLang}
        />
      </div>
      <div className="mb-3 w-full lg:w-2/3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputProjectTags
          tags={project_tags}
          onChange={(tags) => setValue('project_tags', tags)}
        />
        <InputProjectTechs
          tech={project_tech}
          onChange={(tech) => setValue('project_tech', tech)}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="link_repo"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.link_repo ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Link Repo</label>
          <div className="flex w-full">
            <span className={[
              "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
              (errors.link_repo ? 
                "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              )
            ].join(' ')}
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
              </svg>
            </span>
            <input
              id="link_repo"
              className={[
                "border text-sm rounded-e-md block w-full p-2.5",
                (errors.link_repo ? 
                  "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                )
              ].join(' ')}
              type="text" 
              placeholder="Link Repo"
              {...register('link_repo')}
            />
          </div>
        </div>
        <div>
          <label htmlFor="link_demo"
            className={[
              "block mb-2 text-sm font-medium",
              (errors.link_demo ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Link Demo</label>
          <div className="flex w-full">
            <span className={[
              "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
              (errors.link_demo ? 
                "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              )
            ].join(' ')}
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
              </svg>
            </span>
            <input
              id="link_demo"
              className={[
                "border text-sm rounded-e-md block w-full p-2.5",
                (errors.link_demo ? 
                  "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                )
              ].join(' ')}
              type="text" 
              placeholder="Link Demo"
              {...register('link_demo')}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="image_file"
          className={[
            "block mb-2 text-sm font-medium",
            (errors.project_preview ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
          ].join(' ')}
        >
          Project Preview
        </label>
        <DndProvider backend={HTML5Backend}>
          <InputImages
            onImageChange={handleChangeImages}
            initialValue={project_preview}
          />
        </DndProvider>
        {errors.project_preview && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.project_preview.message}</p>}
      </div>
      <div className="flex justify-end mt-24">
        <button disabled={isSaving} onClick={handleSave} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-[150px]">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}