"use server"

import { IProject } from "@/types/IProject"
import { prisma } from "../prisma"
import RepoProjects from "./RepoProjects"
import { join } from "path"
import { writeFile, rm } from "fs/promises"

export const getAll = RepoProjects.getAll
export const getOne = RepoProjects.getOne

export async function save(data: Omit<IProject,'project_id'>) {
  try {
    const project = await prisma.projects.create({
      data: {
        project_title: data.project_title,
        project_desc: data.project_desc,
        project_preview: data.project_preview,
        project_tags: {
          connectOrCreate: data.project_tags.map(({ tag_name }) => ({
            where: { tag_name },
            create: { tag_name },
          }))
        },
        createdAt: data.createdAt,
        published: data.published,
        updatedAt: data.updatedAt,
      },
      include: {
        project_tags: true,
      }
    })
    if(!project) throw Error(`project not saved`)
  
    return project
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('projects save error', message)

    return false
  }
}

export async function remove(project_id: IProject['project_id']) {
  try {
    const project = await prisma.projects.delete({
      where: {
        project_id,
      },
      include: {
        project_tags: true,
      }
    })
    if(!project) throw Error(`project not removed`)
    
    try {
      if(project.project_preview) {
        await deleteFileUploadImagePreview(project.project_preview)
      }
    } catch(error: any) {
      let message = 'unknown'
      if(typeof error == 'string') message = error
      else if(error.message) message = error.message
  
      console.log('projects remove deleteFileUploadImagePreview error', message)
    }
  
    return project
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('projects remove error', message)

    return false
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

export async function uploadImagePreview(file?: File) {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("File type not allowed");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large (max 5MB)");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `project_preview_${file.name}`

  const path = join(process.cwd(), "public/images", filename);
  await writeFile(path, buffer);
  
  return { 
    success: true,
    path: `/images/${filename}`,
  };
}

export async function deleteFileUploadImagePreview(url_path: string) {
  const path = join(process.cwd(), "public", url_path);
  await rm(path)
}