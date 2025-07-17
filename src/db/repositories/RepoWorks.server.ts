'use server';

import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"
import RepoWorks from "./RepoWorks"
import { IWorkExperience, IWorkExperienceFilter } from "@/types/IWorkExperience"
import { deleteFile, uploadImage } from "@/utils/file.server"
import { getErrorMessage } from "@/utils/errorMessage";

export const getAll = RepoWorks.getAll;
export const getOne = RepoWorks.getOne;
export const getAllSkills = RepoWorks.getAllSkills;
export const getAllWorkLocations = RepoWorks.getAllWorkLocations;

export async function saveOrUpdate(data: Omit<IWorkExperience, 'id'> & { id?: IWorkExperience['id'] }) {
  const { id, ...values } = data;
  if(typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
} 

export async function save(data: Omit<IWorkExperience,'id'>) {
  let logoPath: string|undefined|null;
  let logoUploaded = false;
  try {
    if(data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${Date.now()}_company_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }
    const work = await prisma.work.create({
      data: {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        description: data.description,
        employmentType: data.employmentType,
        startDate_month: data.startDate_month,
        startDate_year: data.startDate_year,
        endDate_month: data.endDate_month,
        endDate_year: data.endDate_year,
        hidden: data.hidden,
        logo: logoPath,
        location: {
          connectOrCreate: data.location.map((address) => ({
            where: { address },
            create: { address },
          }))
        },
        skills: {
          connectOrCreate: data.skills.map((skillName) => ({
            where: { skillName },
            create: { skillName },
          }))
        },
      },
      include: {
        location: true,
        skills: true,
      }
    })
    if(!work) throw new Error(`work not saved`);
  
    return work;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'work save error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'work delete logo error');
      }
    }

    return false;
  }
}

export async function update(id: number, data: Omit<IWorkExperience,'id'>) {
  // if set will be deleted after success update
  let oldLogoPath: string|undefined|null;
  let logoPath: string|undefined|null;
  let logoUploaded = false;
  try {
    const old_data = await getOne(id);
    // delete 
    if(old_data?.logo && old_data.logo != data.logo) {
      oldLogoPath = old_data.logo;
    }

    if(data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${Date.now()}_company_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }
    const work = await prisma.work.update({
      data: {
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        description: data.description,
        employmentType: data.employmentType,
        startDate_month: data.startDate_month,
        startDate_year: data.startDate_year,
        endDate_month: data.endDate_month,
        endDate_year: data.endDate_year,
        hidden: data.hidden,
        logo: logoPath,
        location: {
          set: [],
          connectOrCreate: data.location.map((address) => ({
            where: { address },
            create: { address },
          }))
        },
        skills: {
          set: [],
          connectOrCreate: data.skills.map((skillName) => ({
            where: { skillName },
            create: { skillName },
          }))
        },
      },
      include: {
        location: true,
        skills: true,
      },
      where: {
        id,
      },
    })
    if(!work) throw new Error(`work not updated`);

    if(oldLogoPath) {
      try {
        await deleteFile(oldLogoPath);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete old logo error');
      }
    }
  
    return work;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'work update error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'work delete logo error');
      }
    }

    return false;
  }
}

export async function remove(id: number) {
  try {
    const work = await prisma.work.delete({
      where: {
        id,
      },
    })
    if(!work) throw new Error(`work not deleted`);

    if(work.logo) {
      try {
        await deleteFile(work.logo);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete logo error');
      }
    }
  
    return work;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'work remove error');

    return false;
  }
}

export async function getAllByFilter(filter: IWorkExperienceFilter) {
  try {
    const works = await prisma.work.findMany({
      include: {
        location: true,
        skills: true,
      },
      where: {
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
      }
    })
    if(!works) throw Error(`any works not found`)
      
    Logger.info(`"${works.length}" data loaded!`, 'works getAllByFilter')
    return works
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'works getAllByFilter error')

    throw new Error(message);
  }
}

export async function getCountAll() {
  try {
    const works = await prisma.work.count()
      
    Logger.info(`"${works}" works counted!`, 'works getCountAll')
    return works
  } catch(error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'works getCountAll error')

    throw new Error(message);
  }
}

