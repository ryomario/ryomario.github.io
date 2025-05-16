"use client"

import { useEffect, useMemo, useState } from "react"
import { IProject } from "@/types/IProject"
import { date2localeString, date2string } from "@/lib/date"
import { useLocale } from "next-intl"
import { Locale } from "@/i18n/routing"
import { useProjects } from "@/contexts/projectsContext"
import { ProjectCard } from "../home"
import { ImagePreview } from "@/components/reusable/images/imagePreview"

type Props = {
  project: IProject
}

export function ProjectDetailsSection({
  project,
}: Props) {
  const locale = useLocale()
  const [preview, setPreview] = useState<(string | null)[]>([])
  const projects = useProjects({
    published: true,
    tags: project.project_tags,
  })
  const relaatedProjects = useMemo(() => projects.filter(p => p.project_id != project.project_id),[projects,project])

  useEffect(() => {
    if(project?.project_preview && project?.project_preview.length > 0) {
      project?.project_preview.forEach((preview, idx) => {
        const img = new Image()
        const setImgPreview = (src: string|null) => {
          setPreview(old => {
            const newData = [...old]
            newData[idx] = src
            return newData
          })
        }
        img.onload = () => setImgPreview(img.src)
        img.onerror = () => setImgPreview(null)
        img.src = preview.preview_url
      })
    }
  },[project])

  return (
    <section className="w-full py-5 sm:py-10 mt-5 sm:mt-10">
      <div
        className="text-left font-general-medium text-3xl sm:text-4xl font-bold mb-7 text-primary-dark dark:text-primary-light"
      >
        {project.project_title}
      </div>
      <div className="flex">
        <div className="flex items-center mr-10">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-lg text-ternary-dark dark:text-ternary-light" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
            {date2localeString(project.updatedAt, false, locale as Locale)}
          </span>
        </div>
        <div className="flex items-center">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-lg text-ternary-dark dark:text-ternary-light" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <span className="font-general-regular ml-2 leading-none text-primary-dark dark:text-primary-light">
            {project.project_tags.map(({ tag_name }) => tag_name).join(', ')}
          </span>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-10 mt-12"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-10 mt-12">
        {(project.project_preview && project.project_preview.length > 0) && project.project_preview.map((preview, idx) => (
          <ImagePreview
            key={`preview-${idx}`}
            src={preview.preview_url ?? '/images/placeholder-image.jpg'}
            alt={`Preview of ${project.project_title} ${preview.preview_url}`}
            thumbnailClass={`${idx == 0 ? "col-span-full mx-auto":""} max-w-full max-h-[50vh] object-contain rounded-xl cursor-pointer shadow-lg sm:shadow-none`}
          />
        ))}
      </div>

      <div className="block sm:flex gap-0 sm:gap-10 mt-14">
        <div className="w-full sm:w-1/3 text-left">
          <div className="mb-7">
            <p className="text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">Tools & Technologies</p>
            <p className="text-primary-dark dark:text-ternary-light">{project.project_tech.map(({ tech_name }) => tech_name).join(', ')}</p>
          </div>
          {(
            (project.link_demo && project.link_demo.trim() != '')
            || (project.link_repo && project.link_repo.trim() != '')
            ) && <div className="mb-7">
            <p className="text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">Links</p>
            <ul className="leading-loose">
              {(project.link_repo && project.link_repo.trim() != '') && (
                <li className="text-ternary-dark dark:text-ternary-light flex flex-wrap">
                  <span className="w-[8em] font-semibold">Source code</span>
                  <a href={project.link_repo} target="_blank" className="hover:underline break-all">{project.link_repo}</a>
                </li>
              )}
              {(project.link_demo && project.link_demo.trim() != '') && (
                <li className="text-ternary-dark dark:text-ternary-light flex flex-wrap">
                  <span className="w-[8em] font-semibold">Demo</span>
                  <a href={project.link_demo} target="_blank" className="hover:underline break-all">{project.link_demo}</a>
                </li>
              )}
            </ul>
          </div>}
        </div>
        <div className="w-full sm:w-2/3 text-left mt-10 sm:mt-0">
          <p className="text-primary-dark dark:text-primary-light text-2xl font-semibold mb-7">Description</p>
          {project.project_desc.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-5 text-lg text-ternary-dark dark:text-ternary-light">{paragraph}</p>
          ))}
        </div>
      </div>
      {/* relaated projects */}
      {relaatedProjects.length > 0 && <div className="mt-10 pt-10 sm:pt-14 sm:mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
        <p className="font-general-regular text-primary-dark dark:text-primary-light text-3xl font-bold mb-10 sm:mb-14 text-left">Related Projects</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
          {relaatedProjects.map(relaatedProject => (
            <ProjectCard key={relaatedProject.project_id} project={relaatedProject} previewOnly/>
          ))}
        </div>
      </div>}
    </section>
  )
}