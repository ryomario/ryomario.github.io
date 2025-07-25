import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"
import { getErrorMessage } from "@/utils/errorMessage";
import { IPaginationParams } from "@/types/IPagination";
import { IWorkExperience, IWorkExperienceFilter } from "@/types/IWorkExperience";

type GetAllParams = Partial<IPaginationParams> & {
  filter?: IWorkExperienceFilter;
}

async function getAll({ filter, offset = 0, limit = 0 }: GetAllParams = { limit: 0, offset: 0 }): Promise<IWorkExperience[]> {
  try {
    const works = await prisma.work.findMany({
      skip: offset,
      take: limit > 0 ? limit : undefined,
      orderBy: [
        { endDate_year: { sort: 'desc', nulls: "first" } },
        { endDate_month: { sort: 'desc', nulls: "first" } },
        { startDate_month: 'desc' },
        { startDate_year: 'desc' },
      ],
      where: filter ? {
        OR: [
          {
            jobTitle: {
              contains: filter.q,
            }
          },
          {
            companyName: {
              contains: filter.q,
            }
          }
        ],
      } : undefined,
      include: {
        location: true,
        skills: true,
      },
    });
    if (!works) throw new Error('works not found');

    Logger.info(`"${works.length}" works loaded!`, 'works server getAll');
    return works.map(work => ({
      ...work,
      location: work.location.map(loc => loc.address),
      skills: work.skills.map(skill => skill.skillName),
    }));
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'works getAll error')

    throw new Error(message);
  }
}

async function getOne(id: number): Promise<IWorkExperience> {
  try {
    const work = await prisma.work.findFirst({
      where: {
        id,
      },
      include: {
        location: true,
        skills: true,
      }
    });
    if (!work) throw Error(`work with id "${id}" not found`);

    Logger.info(`data with id "${work.id}" loaded!`, 'works getOne');
    return {
      ...work,
      location: work.location.map(loc => loc.address),
      skills: work.skills.map(skill => skill.skillName),
    };
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'work getOne error');

    throw new Error(message);
  }
}

async function getAllSkills() {
  try {
    const skills = await prisma.skill.findMany()
    if (!skills) throw Error(`any skills not found`)

    return skills
  } catch (error: any) {
    let message = 'unknown'
    if (typeof error == 'string') message = error
    else if (error.message) message = error.message

    Logger.error(message, 'work getAllSkills error')

    return []
  }
}

async function getAllWorkLocations() {
  try {
    const locations = await prisma.workLocation.findMany()
    if (!locations) throw Error(`any work locations not found`)

    return locations
  } catch (error: any) {
    let message = 'unknown'
    if (typeof error == 'string') message = error
    else if (error.message) message = error.message

    Logger.error(message, 'work getAllWorkLocations error')

    return []
  }
}

export default {
  getAll,
  getOne,
  getAllSkills,
  getAllWorkLocations,
}