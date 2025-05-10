import { prisma } from "../prisma"

async function getAll() {
  try {
    const projects = await prisma.projects.findMany({
      include: {
        project_tags: true,
      }
    })
    if(!projects) throw Error(`projects not found`)
  
    return projects
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('projects getAll error', message)

    return []
  }
}

async function getOne(id: number) {
  try {
    const project = await prisma.projects.findFirst({
      where: {
        project_id: id,
      },
      include: {
        project_tags: true,
      }
    })
    if(!project) throw Error(`project with id "${id}" not found`)
  
    return project
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('project getOne error', message)

    return null
  }
}

async function getAllTags() {
  try {
    const project_tags = await prisma.project_tags.findMany()
    if(!project_tags) throw Error(`project_tags not found`)
  
    return project_tags
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('project_tags getAllTags error', message)

    return []
  }
}

export default {
  getAll,
  getOne,
  getAllTags,
}