import { routing } from '@/i18n/routing'
import { promises as fs } from 'fs'
import path from 'path'

const CV_DIR = './src/data/cv/'

export type CVProperties = {
  name: string
  aboutme: string
  location: string
  work_experiences: CVWorkExperience[]
  education: CVEducation[]
  skills: string[]
  languages: {
    name: string
    level: string
  }[]
}
type CVWorkExperience = {
  instance_name: string
  position: string
  start_date: string
  end_date: string
  description: string
}
type CVEducation = {
  instance_name: string
  instance_location: string
  description: string
  start_date: string
  end_date: string
}

export async function getCVData(locale: string): Promise<CVProperties> {
  let data: CVProperties | undefined

  try {
    data = JSON.parse(await fs.readFile(path.resolve(CV_DIR,`${locale}.json`),'utf-8'))
  } catch {
    data = JSON.parse(await fs.readFile(path.resolve(CV_DIR,`${routing.defaultLocale}.json`),'utf-8'))
  } finally {
    if(!data) {
      throw new Error('Not found',{cause: '404'})
    }

    return data
  }
}