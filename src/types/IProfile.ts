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
  
  socialLinks: {
    website: string;
    github: string;
    linkedin: string;
    codepen: string;
  }
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