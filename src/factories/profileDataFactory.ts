import { IProfile } from "@/types/IProfile";

export const EMPTY_PROFILE_DATA: IProfile = {
  name: '',
  hireable: false,
  profile_picture: '',
  address: '',
  email: '',
  headline: '',
  intro: '',
  phone: '',
  socialLinks: {
    website: '',
    github: '',
    linkedin: '',
    codepen: '',
  },
  professional: {
    job_industry: [],
    languages: [],
    last_education: 'bachelor',
    managed_people: 0,
    professions: [],
    relevant_career_year_of_experience: 0,
    skills: [],
    status: 'unemployed',
    year_of_experience: 0,
  },
  lastUpdated: new Date('5/1/2025'),
}