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