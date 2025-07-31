import { IProject, IProjectFilter } from "@/types/IProject";

export function filterProjects(data: IProject[], filter: IProjectFilter) {
  return data.filter(d => {
    // filter published
    if (typeof filter.published == 'boolean') {
      if (d.published !== filter.published) return false;
    }
    // filter tags
    if (filter?.tags && filter?.tags.length > 0) {
      if (d.tags.every((tag) => !filter.tags?.some(f_tag => f_tag === tag))) return false; // project_tags contains some tags filtered
    }
    // filter queries
    if (filter?.q && filter?.q.trim() != '') {
      if (
        !d.title.match(new RegExp(filter.q, 'gi')) &&
        !d.desc.match(new RegExp(filter.q, 'gi'))
      ) return false;
    }
    return true;
  });
}