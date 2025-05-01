"use server"

import { IProfile } from "@/types/IProfile"
import { apiGetOne, apiPost } from "../database"
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory"

export async function getProfileData(data_name: string, fallback_value?: string) {
  const query = `
    SELECT data_value FROM profile_data WHERE data_name = ?
  `
  try {
    const value = await apiGetOne<{data_value: string}>(query, [data_name])
    if(!value || !value.data_value) throw Error(`profile_data '${data_name}' not found`)
  
    return value.data_value
  } catch (error) {
    // console.log(error)
    if(fallback_value === undefined) throw error

    return fallback_value
  }
}

export async function getAllProfileData(force_return = false) {
  const fallback_value = EMPTY_PROFILE_DATA
  try {
    const hireable = String(fallback_value.hireable) // optional, return default value
    const lastUpdated = force_return ? fallback_value.lastUpdated?.toISOString() : undefined
    const profileData: IProfile = {
      name: await getProfileData('name', force_return ? fallback_value.name : undefined),
      hireable: (await getProfileData('hireable', hireable)) == 'true',
      downloadCV: await getProfileData('downloadCV', force_return ? fallback_value.downloadCV : undefined),
      socialLinks: {
        codepen: await getProfileData('socialLinks.codepen', force_return ? fallback_value.socialLinks.codepen : undefined),
        github: await getProfileData('socialLinks.github', force_return ? fallback_value.socialLinks.github : undefined),
        linkedin: await getProfileData('socialLinks.linkedin', force_return ? fallback_value.socialLinks.linkedin : undefined),
        website: await getProfileData('socialLinks.website', force_return ? fallback_value.socialLinks.website : undefined),
      },
      lastUpdated: new Date(await getProfileData('lastUpdated', lastUpdated)),
    }

    return profileData
  } catch(error) {
    console.error(error)
    if(!force_return) throw error

    return fallback_value
  }
}

export async function updateProfileData(data: IProfile) {
  const values = [
    ['name', data.name],
    ['downloadCV', data.downloadCV],
    ['hireable', String(data.hireable)],
    ['lastUpdated', data.lastUpdated.toISOString()],
    ['socialLinks.codepen', data.socialLinks.codepen],
    ['socialLinks.github', data.socialLinks.github],
    ['socialLinks.linkedin', data.socialLinks.linkedin],
    ['socialLinks.website', data.socialLinks.website],
  ]
  const query = `
    INSERT INTO profile_data(data_name, data_value)
    VALUES ${values.map(() => '(?, ?)').join(', ')}
    ON CONFLICT(data_name)
    DO UPDATE SET
      data_value = excluded.data_value
    WHERE excluded.data_name = profile_data.data_name;
  `
  try {
    const changes = await apiPost(query, values.flat())

    if(changes <= 0) throw Error(`No changes`)
  
    return true
  } catch (error) {
    console.log('updateProfileData error')
  }
}