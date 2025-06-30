import { FileUploadType } from "./IFileUpload"

export interface IProfile {
  name: string
  hireable: boolean
  downloadCV: string
  socialLinks: {
    website: string
    github: string
    linkedin: string
    codepen: string
  }
  lastUpdated: Date
}

export interface IProfileForm {
  profile_picture: FileUploadType;
  hireable: boolean;

  name: string;
  email: string;
  phone: string;
  address: string;

  headline: string;
}