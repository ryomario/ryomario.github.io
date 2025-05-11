import { IProject, IProjectsTableAdminFilter } from "@/types/IProject";

export function filterProjects(data: IProject[],filter: IProjectsTableAdminFilter) {
  return data.filter(d => {
    // filter published
    if(typeof filter.published == 'boolean') {
      if(d.published !== filter.published) return false
    }
    // filter tags
    if(filter?.tags && filter?.tags.length > 0) {
      if(d.project_tags.every(({tag_name}) => !filter.tags?.some(f => f.tag_name == tag_name))) return false // project_tags contains some tags filtered
    }
    // filter queries
    if(filter?.q && filter?.q.trim() != '') {
      if(!d.project_title.match(new RegExp(filter.q,'gi'))) return false
    }
    return true
  })
}