'use server';

import { IEducation, IFormEducation } from "@/types/IEducation";
import { getErrorMessage } from "@/utils/errorMessage";
import { deleteFile, uploadImage } from "@/utils/file.server";
import { Logger } from "@/utils/logger";
import { prisma } from "../prisma";
import RepoEducations from "./RepoEducations";

const logoDir = 'logo_schools';

export const getAll = RepoEducations.getAll;
export const getOne = RepoEducations.getOne;
export const getAllMajors = RepoEducations.getAllMajors;

export async function saveOrUpdate(data: IFormEducation) {
  const { id, ...values } = data;
  if (typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
}

export async function save(data: Omit<IFormEducation, 'id'>): Promise<IEducation> {
  let logoPath: string | undefined | null;
  let logoUploaded = false;
  try {
    if (data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${logoDir}/${Date.now()}`);
      if (upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }

    let gpa: number | null = Number(data.gpa);
    let gpa_scale: number | null = Number(data.gpa_scale);
    if (Number.isNaN(gpa)) {
      gpa = null;
    }
    if (Number.isNaN(gpa_scale)) {
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
    if (!education) throw new Error(`education not saved`);

    return {
      ...education,
      majors: education.majors.map(major => major.name),
    };
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'education save error');

    // delete uploaded image
    if (logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (errorDelete) {
        Logger.error(getErrorMessage(errorDelete), 'education delete logo error');
      }
    }

    throw new Error(message);
  }
}

export async function update(id: number, data: Omit<IFormEducation, 'id'>): Promise<IEducation> {
  // if set will be deleted after success update
  let oldLogoPath: string | undefined | null;
  let logoPath: string | undefined | null;
  let logoUploaded = false;
  try {
    const old_data = await getOne(id);
    // delete 
    if (old_data?.logo && old_data.logo != data.logo) {
      oldLogoPath = old_data.logo;
    }

    if (data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${logoDir}/${Date.now()}`);
      if (upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }

    let gpa: number | null = Number(data.gpa);
    let gpa_scale: number | null = Number(data.gpa_scale);
    if (Number.isNaN(gpa)) {
      gpa = null;
    }
    if (Number.isNaN(gpa_scale)) {
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
    if (!education) throw new Error(`education not updated`);

    if (oldLogoPath) {
      try {
        await deleteFile(oldLogoPath);
      } catch (error) {
        // catch error, ignore if fail (only logging)
        Logger.error(getErrorMessage(error), 'delete old logo error');
      }
    }

    return {
      ...education,
      majors: education.majors.map(major => major.name),
    };
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'education update error');

    // delete uploaded image
    if (logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (errorDelete: any) {
        Logger.error(getErrorMessage(errorDelete), 'education delete logo error');
      }
    }

    throw new Error(message);
  }
}

export async function remove(id: number): Promise<IEducation> {
  try {
    const education = await prisma.education.delete({
      where: {
        id,
      },
      include: {
        majors: true,
      },
    })
    if (!education) throw new Error(`education not deleted`);

    if (education.logo) {
      try {
        await deleteFile(education.logo);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete logo error');
      }
    }

    return {
      ...education,
      majors: education.majors.map(major => major.name),
    };
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'education remove error');

    throw new Error(message);
  }
}

export async function getCountAll() {
  try {
    const educations = (await getAll()).length;

    Logger.info(`"${educations}" educations counted!`, 'educations getCountAll');
    return educations;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'educations getCountAll error');

    throw new Error(message);
  }
}
