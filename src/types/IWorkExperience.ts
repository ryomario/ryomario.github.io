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

export type IWorkExperience = Omit<Work, 'logo'|'employmentType'|'location'|'skills'> & {
  logo?: string | File | null;
  employmentType: WorkEmploymentType;
  location: string[];
  skills: string[];
}

export type IWorkExperienceFilter = {
  q?: string;
}