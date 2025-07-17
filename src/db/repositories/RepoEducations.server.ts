'use server';

import { Logger } from "@/utils/logger"
import RepoEducations from "./RepoEducations";
import { IEducation, IEducationFilter } from "@/types/IEducation";
import { deleteFile, uploadImage } from "@/utils/file.server";
import { prisma } from "../prisma";
import { getErrorMessage } from "@/utils/errorMessage";

export const getAll = RepoEducations.getAll;
export const getOne = RepoEducations.getOne;
export const getAllMajors = RepoEducations.getAllMajors;

export async function saveOrUpdate(data: Omit<IEducation, 'id'> & { id?: IEducation['id'] }) {
  const { id, ...values } = data;
  if(typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
} 

export async function save(data: Omit<IEducation,'id'>) {
  let logoPath: string|undefined|null;
  let logoUploaded = false;
  try {
    if(data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${Date.now()}_school_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }

    let gpa: number|null = Number(data.gpa);
    let gpa_scale: number|null = Number(data.gpa_scale);
    if(Number.isNaN(gpa)) {
      gpa = null;
    }
    if(Number.isNaN(gpa_scale)) {
      gpa_scale = null;
    }
    const education = await prisma.education.create({
      data: {
        schoolName: data.schoolName,
        activities: data.activities,
        description: data.description,
        degree: data.degree,
        startYear: data.startYear,
        endYear: data.endYear,
        gpa,
        gpa_scale,
        hidden: data.hidden,
        logo: logoPath,
        majors: {
          connectOrCreate: data.majors.map((name) => ({
            where: { name },
            create: { name },
          }))
        },
      },
      include: {
        majors: true,
      }
    })
    if(!education) throw new Error(`education not saved`);
  
    return education;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'education save error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'education delete logo error');
      }
    }

    return false;
  }
}

export async function update(id: number, data: Omit<IEducation,'id'>) {
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
      const upload = await uploadImage(data.logo, `${Date.now()}_school_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }

    let gpa: number|null = Number(data.gpa);
    let gpa_scale: number|null = Number(data.gpa_scale);
    if(Number.isNaN(gpa)) {
      gpa = null;
    }
    if(Number.isNaN(gpa_scale)) {
      gpa_scale = null;
    }
    const education = await prisma.education.update({
      data: {
        schoolName: data.schoolName,
        activities: data.activities,
        description: data.description,
        degree: data.degree,
        startYear: data.startYear,
        endYear: data.endYear,
        gpa,
        gpa_scale,
        hidden: data.hidden,
        logo: logoPath,
        majors: {
          set: [],
          connectOrCreate: data.majors.map((name) => ({
            where: { name },
            create: { name },
          }))
        },
      },
      include: {
        majors: true,
      },
      where: {
        id,
      },
    })
    if(!education) throw new Error(`education not updated`);

    if(oldLogoPath) {
      try {
        await deleteFile(oldLogoPath);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete old logo error');
      }
    }
  
    return education;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'education update error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'education delete logo error');
      }
    }

    return false;
  }
}

export async function remove(id: number) {
  try {
    const education = await prisma.education.delete({
      where: {
        id,
      },
    })
    if(!education) throw new Error(`education not deleted`);

    if(education.logo) {
      try {
        await deleteFile(education.logo);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete logo error');
      }
    }
  
    return education;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'education remove error');

    return false;
  }
}

export async function getAllByFilter(filter: IEducationFilter) {
  try {
    const educations = await prisma.education.findMany({
      include: {
        majors: true,
      },
      where: {
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
      }
    })
    if(!educations) throw Error(`any educations not found`)
      
    Logger.info(`"${educations.length}" data loaded!`, 'educations getAllByFilter')
    return educations
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'educations getAllByFilter error')

    throw new Error(message);
  }
}

export async function getCountAll() {
  try {
    const educations = await prisma.education.count()
      
    Logger.info(`"${educations}" educations counted!`, 'educations getCountAll')
    return educations
  } catch(error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'educations getCountAll error')

    throw new Error(message);
  }
}
