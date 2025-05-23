import { IProfile } from "@/types/IProfile"
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory"
import { prisma } from "@/db/prisma"

async function getOne(data_name: string, fallback_value?: string) {
  try {
    const value = await prisma.profile_data.findFirst({
      where: {
        data_name,
      }
    })
    if(!value || !value.data_value) throw Error(`profile_data '${data_name}' not found`)
  
    return value.data_value
  } catch (error) {
    console.log(error)
    if(fallback_value === undefined) throw error
  
    return fallback_value
  }
}

async function getAll(force_return = false) {
  const fallback_value = EMPTY_PROFILE_DATA
  try {
    const hireable = String(fallback_value.hireable) // optional, return default value
    const lastUpdated = force_return ? fallback_value.lastUpdated?.toISOString() : undefined
    const profileData: IProfile = {
      name: await getOne('name', force_return ? fallback_value.name : undefined),
      hireable: (await getOne('hireable', hireable)) == 'true',
      downloadCV: await getOne('downloadCV', force_return ? fallback_value.downloadCV : undefined),
      socialLinks: {
        codepen: await getOne('socialLinks.codepen', force_return ? fallback_value.socialLinks.codepen : undefined),
        github: await getOne('socialLinks.github', force_return ? fallback_value.socialLinks.github : undefined),
        linkedin: await getOne('socialLinks.linkedin', force_return ? fallback_value.socialLinks.linkedin : undefined),
        website: await getOne('socialLinks.website', force_return ? fallback_value.socialLinks.website : undefined),
      },
      lastUpdated: new Date(await getOne('lastUpdated', lastUpdated)),
    }

    return profileData
  } catch(error) {
    console.error(error)
    if(!force_return) throw error

    return fallback_value
  }
}

export default {
  getOne,
  getAll,
}


