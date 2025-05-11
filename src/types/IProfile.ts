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