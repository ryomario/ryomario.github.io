"use server"

import { IProfile } from "@/types/IProfile"
import { prisma } from "@/db/prisma"

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
  try {
    const query = `
      INSERT INTO profile_data(data_name, data_value)
      VALUES ${values.map(([data_name, data_value]) => `('${data_name}', '${data_value}')`).join(', ')}
      ON CONFLICT(data_name)
      DO UPDATE SET
        data_value = excluded.data_value
      WHERE excluded.data_name = profile_data.data_name;
    `
    const changes = await prisma.$executeRawUnsafe(query)

    if(changes <= 0) throw Error(`No changes`)
  
    return true
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    console.log('updateProfileData error', message)
  }
}
