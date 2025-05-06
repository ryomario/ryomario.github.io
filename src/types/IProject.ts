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
}