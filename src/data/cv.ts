import RepoEducations from '@/db/repositories/RepoEducations'
import RepoLicenses from '@/db/repositories/RepoLicenses'
import RepoProfileData from '@/db/repositories/RepoProfileData'
import RepoProjects from '@/db/repositories/RepoProjects'
import RepoWorks from '@/db/repositories/RepoWorks'
import { Locale } from '@/i18n/routing'
import { IEducation } from '@/types/IEducation'
import { ILicense } from '@/types/ILicense'
import { IProfile } from '@/types/IProfile'
import { IProject } from '@/types/IProject'
import { IWorkExperience } from '@/types/IWorkExperience'

export type CVProperties = {
  profile: IProfile;
  work_experiences: IWorkExperience[];
  educations: IEducation[];
  licenses: ILicense[];
  projects: IProject[];
}

export async function getCVData(locale: Locale): Promise<CVProperties> {
  const profile = await RepoProfileData.getAll();
  const work_experiences = await RepoWorks.getAll();
  const educations = await RepoEducations.getAll();
  const licenses = await RepoLicenses.getAll();
  const projects = await RepoProjects.getAll({ filter: { published: true }, limit: 0, offset: 0 });

  return {
    profile,
    work_experiences,
    educations,
    licenses,
    projects,
  };
}