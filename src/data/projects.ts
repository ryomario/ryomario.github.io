import { routing } from '@/i18n/routing'
import { promises as fs } from 'fs'
import path from 'path'

const PROJECTS_DIR = './src/data/projects/'

export type Project = {
  name: string
  title: string
  desc: string
  imgUrl: string
  tags: string[]
  dateCreated: Date
}

export async function getProjects(): Promise<string[]> {
  return await fs.readdir(PROJECTS_DIR)
}

export async function getOneProjectData(name: string,locale: string): Promise<Project> {
  let project: Project | undefined

  try {
    project = JSON.parse(await fs.readFile(path.resolve(PROJECTS_DIR,name,`${locale}.json`),'utf-8'))
  } catch (error) {
    console.log('Readdir error', error)
    project = JSON.parse(await fs.readFile(path.resolve(PROJECTS_DIR,name,`${routing.defaultLocale}.json`),'utf-8'))
  } finally {
    if(!project) {
      throw new Error('Not found',{cause: '404'})
    }
    project.name = name
    project.dateCreated = new Date(project.dateCreated)

    return project
  }
}

export async function getProjectsData(locale: string): Promise<Project[]> {
  const projects: Project[] = []

  try {
    const projectNames = await getProjects()

    for (const projectName of projectNames) {
      let project
      try {
        project = await getOneProjectData(projectName,locale)
      } catch {
        project = await getOneProjectData(projectName,routing.defaultLocale)
      } finally {
        if(!!project) {
          projects.push(project)
        }
      }
    }
  } catch (error) {
    console.log('Readdir error', error)
  } finally {
    return projects
  }
}
