"use server"

import { IProject } from "@/types/IProject"
import { prisma } from "../prisma"
import RepoProjects from "./RepoProjects"
import { join } from "path"
import { writeFile, rm } from "fs/promises"
import sharp from 'sharp'

export const getAll = RepoProjects.getAll
export const getOne = RepoProjects.getOne
export const getAllTags = RepoProjects.getAllTags
export const getAllTechs = RepoProjects.getAllTechs

export async function save(data: Omit<IProject,'project_id'>) {
  try {
    const project = await prisma.projects.create({
      data: {
        project_title: data.project_title,
        project_desc: data.project_desc,
        project_preview: {
          createMany: {
            data: data.project_preview.map((preview, idx) => ({
              preview_url: preview.preview_url,
              order: idx,
            })),
          },
        },
        project_tags: {
          connectOrCreate: data.project_tags.map(({ tag_name }) => ({
            where: { tag_name },
            create: { tag_name },
          }))
        },
        project_tech: {
          connectOrCreate: data.project_tech.map(({ tech_name }) => ({
            where: { tech_name },
            create: { tech_name },
          }))
        },
        createdAt: data.createdAt,
        published: data.published,
        updatedAt: data.updatedAt,
        link_repo: data.link_repo ?? null,
        link_demo: data.link_demo ?? null,
      },
      include: {
        project_tags: true,
        project_tech: true,
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

export async function update(project_id: IProject['project_id'], data: Omit<IProject,'project_id'>) {
  try {
    const old_project = await getOne(project_id)
    if(old_project?.project_preview && old_project?.project_preview.length > 0) {
      for(const preview of old_project.project_preview) {
        if(data.project_preview.findIndex(p => p.preview_url == preview.preview_url) == -1) {
          // delete old image
          await removeProjectPreview(preview.preview_id)
        }
      }
    }
    const project = await prisma.projects.update({
      data: {
        project_title: data.project_title,
        project_desc: data.project_desc,
        project_preview: {
          upsert: data.project_preview.map(({preview_url}, idx) => ({
            update: { order: idx },
            create: { preview_url, order: idx },
            where: { preview_url },
          })),
        },
        project_tags: {
          set: [],
          connectOrCreate: data.project_tags.map(({ tag_name }) => ({
            where: { tag_name },
            create: { tag_name },
          }))
        },
        project_tech: {
          set: [],
          connectOrCreate: data.project_tech.map(({ tech_name }) => ({
            where: { tech_name },
            create: { tech_name },
          }))
        },
        published: data.published,
        updatedAt: data.updatedAt,
        link_repo: data.link_repo ?? null,
        link_demo: data.link_demo ?? null,
      },
      include: {
        project_tags: true,
        project_tech: true,
      },
      where: {
        project_id,
      }
    })
    if(!project) throw Error(`project not updated`)
  
    return project
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('projects update error', message)

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
        project_tech: true,
        project_preview: true,
      }
    })
    if(!project) throw Error(`project not removed`)
    
    try {
      if(project.project_preview && project.project_preview.length > 0) {
        for(const preview of project.project_preview) {
          // delete old image
          await removeProjectPreview(preview.preview_id)
        }
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

export async function removeProjectPreview(preview_id: number) {
  try {
    const preview = await prisma.project_previews.delete({
      where: {
        preview_id,
      },
    })
    if(!preview) throw Error(`preview not removed`)
    
    try {
      if(preview.preview_url) {
        await deleteFileUploadImagePreview(preview.preview_url)
      }
    } catch(error: any) {
      let message = 'unknown'
      if(typeof error == 'string') message = error
      else if(error.message) message = error.message
  
      console.log('projects preview remove removeProjectPreview error', message)
    }
  
    return preview
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('project preview remove error', message)

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
  
  // Convert to WebP
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 100 })
    .toBuffer();

  const filename = `${Date.now()}_project_preview.webp`

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