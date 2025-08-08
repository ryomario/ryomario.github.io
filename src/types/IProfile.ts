import { FileUploadType } from "./IFileUpload"

export interface IProfile {
  profile_picture: string;
  hireable: boolean;

  name: string;
  email: string;
  phone: string;
  address: string;
  
  headline: string;
  intro: string;
  
  socialLinks: IProfileSocialLinks;
  professional: IProfileProfessional;
  lastUpdated: Date;
}

export interface IProfileForm {
  profile_picture: FileUploadType;
  hireable: boolean;

  name: string;
  email: string;
  phone: string;
  address: string;

  headline: string;
  intro: string;
}

export interface IProfileSocialLinks {
  website: string;
  github: string;
  linkedin: string;
  codepen: string;
}

export interface IProfileProfessional {
  status: 'employed'|'unemployed'|'study'|'military_service';
  professions: string[];
  job_industry: string[];
  year_of_experience: number;
  relevant_career_year_of_experience: number;
  managed_people: number;
  skills: string[];
  last_education: 'less_high_school'|'high_school'|'associate'|'bachelor'|'master'|'doctoral';
  languages: IProfileProfessionalLanguage[];
}

export interface IProfileProfessionalLanguage {
  name: string;
  level: number;
}