import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"
import { getErrorMessage } from "@/utils/errorMessage"
import { IProject } from "@/types/IProject";

async function getAll(offset = 0, limit = 0) {
  try {
    const projects = await prisma.project.findMany({
      skip: offset,
      take: limit > 0 ? limit : undefined,
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        tags: true,
        previews: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!projects) throw Error(`projects not found`);

    Logger.info(`"${projects.length}" projects loaded!`, 'projects getAll');
    return projects;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'projects getAll error');

    throw new Error(message);
  }
}

async function getOne(id: number) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        tags: true,
        previews: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!project) throw Error(`project with id "${id}" not found`);

    return project;
  } catch (error: any) {
    const message = getErrorMessage(error);
    Logger.error(message, 'project getOne error');

    throw new Error(message);
  }
}

async function getAllTags(): Promise<IProject['tags']> {
  try {
    const project_tags = await prisma.projectTag.findMany();
    if (!project_tags) throw Error(`projectTag not found`);

    return project_tags.map(({ tag_name }) => tag_name);
  } catch (error: any) {
    const message = getErrorMessage(error);
    Logger.error(message, 'project getAllTags error');

    throw new Error(message);
  }
}

export default {
  getAll,
  getOne,
  getAllTags,
}