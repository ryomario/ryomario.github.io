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

// default values (callback values), the real values are fetched from i18n messages
export const projectsData: Project[] = [
  {
    name: "webstatic_bookshelf",
    title: "Webstatic BookShelf",
    desc: "BookShelf web application",
    imgUrl: "https://github.com/ryomario/webstatic-bookshelf/blob/main/images/preview%20%5Btheme%20dark%5D.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-08-2022'),
  },
  {
    name: "homepage",
    title: "Homepage",
    desc: "Web application build with ReactJS. Includes a simple clock app and the main function is to store some URL in web storage.",
    imgUrl: "https://github.com/ryomario/homepage/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('11-12-2023'),
  },
  {
    name: "calcku",
    title: "CalcKu",
    desc: "Calculator web based application. Do some actions like real calculator.",
    imgUrl: "https://github.com/ryomario/calcku/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-19-2024'),
  },
]
.map((data, id) => ({...data,id: id +1})) // set id by array index

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
      } catch (error) {
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
