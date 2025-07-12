import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"

async function getAll() {
  try {
    const works = await prisma.work.findMany({
      include: {
        location: true,
        skills: true,
      }
    })
    if(!works) throw Error(`any works not found`)
  
    return works
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'works getAll error')

    return []
  }
}

async function getOne(id: number) {
  try {
    const work = await prisma.work.findFirst({
      where: {
        id,
      },
      include: {
        location: true,
        skills: true,
      }
    })
    if(!work) throw Error(`work with id "${id}" not found`)
  
    return work
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'work getOne error')

    return null
  }
}

async function getAllSkills() {
  try {
    const skills = await prisma.skill.findMany()
    if(!skills) throw Error(`any skills not found`)
  
    return skills
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'work getAllSkills error')

    return []
  }
}

async function getAllWorkLocations() {
  try {
    const locations = await prisma.workLocation.findMany()
    if(!locations) throw Error(`any work locations not found`)
  
    return locations
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'work getAllWorkLocations error')

    return []
  }
}

export default {
  getAll,
  getOne,
  getAllSkills,
  getAllWorkLocations,
}