export enum WorkEmploymentType {
  FULL_TIME,
  PART_TIME,
  CONTRACT,
  TEMPORARY,
  VOLUNTEER,
  INTERNSHIP,
  FREELANCE,
} 

export interface IWorkExperience {
  id: number;
  logo?: string | File | null;
  companyName: string;
  jobTitle: string;
  employmentType: WorkEmploymentType;
  location: string[];
  skills: string[];
  description: string;
  startDate_month: number;
  startDate_year: number;
  endDate_month?: number;
  endDate_year?: number;
}