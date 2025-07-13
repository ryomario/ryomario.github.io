import { IWorkExperience } from "@/types/IWorkExperience";
import { Work, WorkLocation, Skill } from "@/generated/prisma";

type WorkSelectedFields = Work & {
  location: WorkLocation[];
  skills: Skill[];
};

export function dbWorkTransform(data: WorkSelectedFields): IWorkExperience {
  return {
    ...data,
    location: data.location.map(({ address }) => address),
    skills: data.skills.map(({ skillName }) => skillName),
  };
}

export function dbWorkSkillsTransform(data: Skill[]): IWorkExperience['skills'] {
  return data.map(({ skillName }) => skillName);
}

export function dbWorkLocatoinsTransform(data: WorkLocation[]): IWorkExperience['location'] {
  return data.map(({ address }) => address);
}