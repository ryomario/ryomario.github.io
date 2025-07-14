import { Work } from "@/generated/prisma";

export enum WorkEmploymentType {
  FULL_TIME,
  PART_TIME,
  CONTRACT,
  TEMPORARY,
  VOLUNTEER,
  INTERNSHIP,
  FREELANCE,
}

export function getWorkEmploymentLabel(type: WorkEmploymentType): string {
  switch(type) {
    case WorkEmploymentType.CONTRACT: return 'Contract';
    case WorkEmploymentType.FREELANCE: return 'Freelance';
    case WorkEmploymentType.FULL_TIME: return 'Full-time';
    case WorkEmploymentType.INTERNSHIP: return 'Internship';
    case WorkEmploymentType.PART_TIME: return 'Part-time';
    case WorkEmploymentType.TEMPORARY: return 'Temporary';
    case WorkEmploymentType.VOLUNTEER: return 'Volunteer';
    default: return '';
  }
}

export type IWorkExperience = Omit<Work, 'logo'|'employmentType'|'location'|'skills'> & {
  logo?: string | File | null;
  employmentType: WorkEmploymentType;
  location: string[];
  skills: string[];
}

export type IWorkExperienceFilter = {
  q?: string;
}