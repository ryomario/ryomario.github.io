"use client"

import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext"
import { IProfile } from "@/types/IProfile"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { ButtonLoading } from "./buttonLoading"
import { date2string } from "@/lib/date"
import * as RepoProfileData_server from "@/db/repositories/RepoProfileData.server"

export function FormProfileData() {
  const profileData = useProfileData()
  const updateProfileData = useUpdateProfileData()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IProfile>({
    values: profileData,
    mode: "all"
  })

  const userInfo = watch(['name', 'hireable', 'downloadCV'])
  const socialLinks = watch(['socialLinks.website', 'socialLinks.codepen', 'socialLinks.github', 'socialLinks.linkedin'])
  const lastUpdated = watch('lastUpdated')

  const linkCVRef = useRef<string>(profileData.downloadCV)
  const [isDownloadCVExternal,setIsDownloadCVExternal] = useState(!profileData.downloadCV.startsWith('/'))

  const isCompleteUserInfo = useMemo(() => userInfo.every((value, idx) => {
    if(idx == 1) return true // optional hireable
    return !!value && value != ''
  }),[userInfo])
  const isCompleteSocialLinks = useMemo(() => socialLinks.every((value, idx) => {
    if(idx == 0) return true // optional link website
    return !!value && value != ''
  }),[socialLinks])

  const handleChangeDownloadExternalLinkCV = useCallback((isExternalLink: boolean) => {
    if(isExternalLink) {
      setValue('downloadCV', linkCVRef.current)
    } else {
      linkCVRef.current = userInfo[2]
      setValue('downloadCV', '/cv/download')
    }
    trigger('downloadCV')
    setIsDownloadCVExternal(isExternalLink)
  },[setValue,trigger,userInfo,setIsDownloadCVExternal])

  const onSubmit = handleSubmit(async (values: IProfile) => {
    const updatedAt = new Date()
    const data: IProfile = {
      ...values,
      lastUpdated: updatedAt,
    }
    setValue('lastUpdated', updatedAt)
    await RepoProfileData_server.updateProfileData(data)
    
    updateProfileData(data)
  })

  useEffect(() => {
    trigger() // trigger validation on init
  },[trigger, profileData])


  // console.log(isSubmitting)

  return <>
    <div className="flex items-start w-full space-x-4">
      <ol className="space-y-4 w-72 hidden sm:block flex-none sticky top-4">
        <StepperItem label="1. User info" completed={isCompleteUserInfo}/>
        <StepperItem label="2. Social accounts" completed={isCompleteSocialLinks}/>
        <li><b>Last updated : </b>{date2string(lastUpdated)}</li>
      </ol>
      <div className="flex-1">
        <form onSubmit={onSubmit}>
          <h4 className="text-2xl font-bold dark:text-white mb-4" id="user-info">User info</h4>
          <div className="grid gap-6 mb-3 md:grid-cols-2 items-end">
            <div>
              <label htmlFor="name" className={[
                "inline-block mb-2 text-sm font-medium",
                (errors.name ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
              ].join(' ')}>Name</label>
              <input
                id="name"
                className={[
                  "border text-sm rounded-lg block w-full p-2.5",
                  (errors.name ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="text" 
                placeholder="Name"
                {...register('name', { required: true })}
              />
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register('hireable')}/>
                <div className="relative w-11 h-6 md:my-2 bg-gray-200 rounded-full peer peer-focus:outline-4 peer-focus:outline-blue-300 dark:peer-focus:outline-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hireable</span>
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="download-cv" className={[
              "inline-block mb-2 text-sm font-medium",
              (errors.downloadCV ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Download CV (External URL)</label>
            <div className="flex">
              <span className={[
                "inline-flex items-center px-3 text-sm border rounded-0 border-e-0 rounded-s-md",
                (errors.downloadCV ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
                </svg>
              </span>
              <label className={[
                "inline-flex items-center cursor-pointer px-3 border rounded-0 border-e-0",
                (errors.downloadCV ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <input type="checkbox" className="peer sr-only" checked={isDownloadCVExternal} onChange={(e) => handleChangeDownloadExternalLinkCV(e.target.checked)}/>
                <div className={[
                  "relative w-9 h-5 bg-[#0002] peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600",
                  (errors.downloadCV ? 
                    "peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:bg-red-600 dark:peer-checked:bg-red-600"
                    : "peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                  )
                ].join(' ')}
                ></div>
              </label>
              <input
                id="download-cv"
                className={[
                  "border text-sm rounded-e-md block w-full p-2.5",
                  (errors.downloadCV ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : !isDownloadCVExternal ?
                    "bg-gray-200 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="url" 
                placeholder="URL Download CV"
                {...register('downloadCV', { required: true })}
                disabled={!isDownloadCVExternal}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Internal URL is default to <code className="bg-[#0002] inline-block px-1 rounded-md">{"{locale}"}/cv/download</code>
            </p>
          </div>
          <h4 className="text-2xl font-bold dark:text-white mb-4" id="social-accounts">Social Accounts</h4>
          <div className="mb-3">
            <label htmlFor="socialLink-github" className={[
              "inline-block mb-2 text-sm font-medium",
              (errors.socialLinks?.github ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Github</label>
            <div className="flex w-full lg:w-1/2">
              <span className={[
                "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
                (errors.socialLinks?.github ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd"/>
                </svg>
              </span>
              <input
                id="socialLink-github"
                className={[
                  "border text-sm rounded-e-md block w-full p-2.5",
                  (errors.socialLinks?.github ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="text" 
                placeholder="URL Github Profile"
                {...register('socialLinks.github', { required: true })}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="socialLink-linkedin" className={[
              "inline-block mb-2 text-sm font-medium",
              (errors.socialLinks?.linkedin ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Linkedin</label>
            <div className="flex w-full lg:w-1/2">
              <span className={[
                "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
                (errors.socialLinks?.linkedin ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd"/>
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
                </svg>
              </span>
              <input
                id="socialLink-linkedin"
                className={[
                  "border text-sm rounded-e-md block w-full p-2.5",
                  (errors.socialLinks?.linkedin ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="text" 
                placeholder="URL Linkedin Profile"
                {...register('socialLinks.linkedin', { required: true })}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="socialLink-codepen" className={[
              "inline-block mb-2 text-sm font-medium",
              (errors.socialLinks?.codepen ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Codepen</label>
            <div className="flex w-full lg:w-1/2">
              <span className={[
                "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
                (errors.socialLinks?.codepen ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 0 26 26" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.7L33 24l11-7.3V9.3L33 2L22 9.3V16.7z M44 16.7L33 9.3l-11 7.4 M22 9.3l11 7.3 l11-7.3 M33 2v7.3 M33 16.7V24 "></path>
                </svg>
              </span>
              <input
                id="socialLink-codepen"
                className={[
                  "border text-sm rounded-e-md block w-full p-2.5",
                  (errors.socialLinks?.codepen ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="text" 
                placeholder="URL Codepen Profile"
                {...register('socialLinks.codepen', { required: true })}
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="socialLink-website" className={[
              "inline-block mb-2 text-sm font-medium",
              (errors.socialLinks?.website ? "text-red-700 dark:text-red-500":"text-gray-900 dark:text-white")
            ].join(' ')}>Website</label>
            <div className="flex w-full lg:w-1/2">
              <span className={[
                "inline-flex items-center px-3 text-sm border rounded-e-0 border-e-0 rounded-s-md",
                (errors.socialLinks?.website ? 
                  "text-red-900 bg-red-200 border-red-300 dark:bg-red-600 dark:text-red-400 dark:border-red-600"
                  : "text-gray-900 bg-gray-200 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                )
              ].join(' ')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </span>
              <input
                id="socialLink-website"
                className={[
                  "border text-sm rounded-e-md block w-full p-2.5",
                  (errors.socialLinks?.website ? 
                    "bg-red-50 border-red-500 text-red-900 placeholder-red-400 focus:outline-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:placeholder-gray-400 focus:outline-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:outline-blue-500 dark:focus:border-blue-500"
                  )
                ].join(' ')}
                type="text" 
                placeholder="URL Web Page"
                {...register('socialLinks.website')}
              />
            </div>
          </div>
          <div className="block sm:hidden mb-6"><b>Last updated : </b>{date2string(lastUpdated)}</div>
          <ButtonLoading
            type="submit"
            className="w-full sm:w-auto"
            loading={isSubmitting}
          >Submit</ButtonLoading>
        </form>
      </div>
    </div>
  </>
}

function StepperItem({
  label,
  completed = false,
  active = false,
}: {
  label: string
  completed?: boolean
  active?: boolean
}) {
  return <li>
    <div className={[
      "w-full p-4 border rounded-lg",
      (active ? "text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400"
        : completed ? "text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400"
        : "text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
      )
    ].join(' ')} role="alert">
      <div className="flex items-center justify-between">
        <span className="sr-only">{label}</span>
        <h3 className="font-medium">{label}</h3>
        {active ? <svg className="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg> : completed && <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
        </svg>}
      </div>
    </div>
  </li>
}