import { useUpdateProjects } from "@/contexts/projectsContext";
import { IProject } from "@/types/IProject";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server"
import { ImageType } from "../components/inputImage";

export function useInputProjectHook(project?: IProject) {
  const isFormUpdate = useMemo(() => !!project,[project])
  const updateProjects = useUpdateProjects()
  const [images, setImages] = useState<(File|string)[]>([])

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting: isSaving },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<Partial<IProject>>({
    defaultValues: project ?? {},
  })
  
  useEffect(() => {
    if(images) clearErrors('project_preview')
  },[images])

  const onSave = handleSubmit(async (value: Partial<IProject>) => {
    // console.log('save',value)
    if(!isFormUpdate && images.length == 0) {
      setError('project_preview', {
        type: 'required',
        message: 'Please choose an image preview',
      })
      return
    }

    let res_upload
    try {
      if(images.length == 0) {
        if(isFormUpdate) {
          if(!value.project_preview || value.project_preview.length == 0) {
            throw Error('Please choose an image preview')
          }
          res_upload = {
            success: true,
            previews: value.project_preview,
          }
        } else {
          throw Error('Please choose an image preview')
        }
      } else {
        res_upload = {
          success: false,
          previews: [] as IProject['project_preview'],
        }
        for(const image of images) {
          let image_url
          if(image instanceof File) {
            const upload = await RepoProjects_server.uploadImagePreview(image)
            image_url = upload.path
          } else {
            image_url = image
          }
          res_upload.previews.push({ preview_url: image_url })
        }
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
        project_preview: res_upload.previews,
        createdAt: new Date(),
        updatedAt: new Date(),
        project_tags: value.project_tags ?? [],
        project_tech: value.project_tech ?? [],
        published: value.published ?? false,
        link_demo: value.link_demo ?? '',
        link_repo: value.link_repo ?? '',
      }

      let saved
      if(isFormUpdate) {
        saved = await RepoProjects_server.update(project?.project_id!!,new_project)
      } else {
        saved = await RepoProjects_server.save(new_project)

      }
      // console.log('saved', saved)
      if(saved) {
        updateProjects(
          await RepoProjects_server.getAll(),
          await RepoProjects_server.getAllTags(),
          await RepoProjects_server.getAllTechs(),
        )
        reset()
      }
    } catch(error) {
      console.log((error as Error).message ?? 'Unknown error')
      return
    }
  })

  const handleChangeImages = useCallback((images: ImageType[]) => {
    const newImages: (string|File)[] = []
    images.forEach(image => {
      if(image.preview?.startsWith('/')) {
        newImages.push(image.preview)
      } else if(image.file) {
        newImages.push(image.file)
      }
    })
    setImages(newImages)
  },[setImages])

  useEffect(() => {
    reset()
  },[open])

  return {
    onSave,
    register,
    errors,
    watch,
    setValue,
    handleChangeImages,
    isSaving,
  }
}