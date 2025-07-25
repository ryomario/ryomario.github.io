import { Logger } from "@/utils/logger";
import { prisma } from "../prisma";
import { getErrorMessage } from "@/utils/errorMessage";
import { IPaginationParams } from "@/types/IPagination";
import { IEducation, IEducationFilter } from "@/types/IEducation";

type GetAllParams = Partial<IPaginationParams> & {
  filter?: IEducationFilter;
}

async function getAll({ filter, offset = 0, limit = 0 }: GetAllParams = { limit: 0, offset: 0 }): Promise<IEducation[]> {
  try {
    const educations = await prisma.education.findMany({
      skip: offset,
      take: limit > 0 ? limit : undefined,
      orderBy: [
        { endYear: 'desc' },
        { startYear: 'desc' },
      ],
      where: filter ? {
        OR: [
          {
            schoolName: {
              contains: filter.q,
            }
          },
          {
            degree: {
              contains: filter.q,
            }
          }
        ],
      } : undefined,
      include: {
        majors: true,
      }
    });
    if (!educations) throw Error(`any educations not found`);

    Logger.info(`"${educations.length}" data loaded!`, 'educations getAll');
    return educations.map(edu => ({
      ...edu,
      majors: edu.majors.map(({ name }) => name),
    }));
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'educations getAll error')

    throw new Error(message);
  }
}

async function getOne(id: number): Promise<IEducation> {
  try {
    const education = await prisma.education.findFirst({
      where: {
        id,
      },
      include: {
        majors: true,
      }
    });
    if (!education) throw Error(`education with id "${id}" not found`);

    Logger.info(`data with id "${education.id}" loaded!`, 'educations getOne');
    return {
      ...education,
      majors: education.majors.map(({ name }) => name),
    };
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'education getOne error')

    throw new Error(message);
  }
}

async function getAllMajors() {
  try {
    const majors = await prisma.educationMajor.findMany();
    if (!majors) throw Error(`any majors not found`);

    return majors;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'education getAllMajors error');

    throw new Error(message);
  }
}

export default {
  getAll,
  getOne,
  getAllMajors,
}