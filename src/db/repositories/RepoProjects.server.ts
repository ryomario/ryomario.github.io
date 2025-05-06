"use server"

import { IProject } from "@/types/IProject"
import { prisma } from "../prisma"
import RepoProjects from "./RepoProjects"

export const getAll = RepoProjects.getAll

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
