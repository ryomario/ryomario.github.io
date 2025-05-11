import { IProfile } from "@/types/IProfile";

export const EMPTY_PROFILE_DATA: IProfile = {
  name: '',
  hireable: false,
  downloadCV: '',
  socialLinks: {
    website: '',
    github: '',
    linkedin: '',
    codepen: '',
  },
  lastUpdated: new Date('5/1/2025'),
}