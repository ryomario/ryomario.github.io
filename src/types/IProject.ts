export interface IProject {
  project_id: number
  project_title: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  project_desc: string
  project_preview: string
  project_tags: {
    tag_name: string
  }[]
  project_tech: {
    tech_name: string
  }[]
  link_repo: string | null
  link_demo: string | null
}

export type IProjectsTableAdminFilter = {
  q?: string
  tags?: IProject['project_tags']
  published?: boolean
}