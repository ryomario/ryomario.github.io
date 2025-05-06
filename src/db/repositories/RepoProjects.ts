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

export default {
  getAll,
}