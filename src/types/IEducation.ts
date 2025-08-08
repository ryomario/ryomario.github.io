import { Education } from "@/generated/prisma";

export const EDUCATION_DEGREES = [
  "Associate’s Degree",
  "Bachelor of Arts (BA)",
  "Bachelor of Business Administration (BBA)",
  "Bachelor of Engineering (BEng)",
  "Bachelor of Fine Arts (BFA)",
  "Bachelor of Science (BS)",
  "Bachelor’s Degree",
  "Engineer’s Degree",
  "Master of Arts (MA)",
  "Master of Business Administration (MBA)",
  "Master of Fine Arts (MFA)",
  "Master of Science (MS)",
  "Master’s Degree",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)",
  "Juris Doctor (JD)",
  "High School Diploma",
  "Non-Degree Program (e.g. Coursera certificate)",
];

export type IEducation = Omit<Education, 'logo'> & {
  logo?: string | null;
  majors: string[];
}

export type IFormEducation = Omit<IEducation, 'id'|'logo'> & {
  id?: IEducation['id'] | null;
  logo?: IEducation['logo'] | File;
}

export type IEducationFilter = {
  q?: string;
}