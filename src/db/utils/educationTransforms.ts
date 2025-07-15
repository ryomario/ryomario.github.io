import { Education, EducationMajor } from "@/generated/prisma";
import { IEducation } from "@/types/IEducation";

type EducationSelectedFields = Education & {
  majors: EducationMajor[];
};

export function dbEducationTransform(data: EducationSelectedFields): IEducation {
  return {
    ...data,
    majors: data.majors.map(({ name }) => name),
  };
}

export function dbEducationMajorsTransform(data: EducationMajor[]): IEducation['majors'] {
  return data.map(({ name }) => name);
}
