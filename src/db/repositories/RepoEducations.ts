import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"

async function getAll() {
  try {
    const educations = await prisma.education.findMany({
      include: {
        majors: true,
      }
    })
    if(!educations) throw Error(`any educations not found`)
      
    Logger.info(`"${educations.length}" data loaded!`, 'educations getAll')
    return educations
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'educations getAll error')

    return []
  }
}

async function getOne(id: number) {
  try {
    const education = await prisma.education.findFirst({
      where: {
        id,
      },
      include: {
        majors: true,
      }
    })
    if(!education) throw Error(`education with id "${id}" not found`)
  
    Logger.info(`data with id "${education.id}" loaded!`, 'educations getOne')
    return education
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'education getOne error')

    return null
  }
}

async function getAllMajors() {
  try {
    const majors = await prisma.educationMajor.findMany()
    if(!majors) throw Error(`any majors not found`)
  
    return majors
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'education getAllMajors error')

    return []
  }
}

export default {
  getAll,
  getOne,
  getAllMajors,
}