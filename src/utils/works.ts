import { IWorkExperience, IWorkExperienceFilter } from "@/types/IWorkExperience";

export function filterWorks(works: IWorkExperience[], filter: IWorkExperienceFilter) {
  return works.filter(d => {
    // filter queries
    if(filter.q && filter.q.trim() != '') {
      if(!d.jobTitle.match(new RegExp(filter.q,'gi'))) return false
    }

    return true;
  });
}