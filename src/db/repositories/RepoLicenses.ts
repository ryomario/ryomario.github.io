import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"

async function getAll() {
  try {
    const licenses = await prisma.license.findMany()
    if(!licenses) throw Error(`any licenses not found`)
      
    Logger.info(`"${licenses.length}" data loaded!`, 'licenses getAll')
    return licenses
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'licenses getAll error')

    return []
  }
}

async function getOne(id: number) {
  try {
    const license = await prisma.license.findFirst({
      where: {
        id,
      }
    })
    if(!license) throw Error(`license with id "${id}" not found`)
  
    Logger.info(`data with id "${license.id}" loaded!`, 'licenses getOne')
    return license
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'license getOne error')

    return null
  }
}

export default {
  getAll,
  getOne,
}