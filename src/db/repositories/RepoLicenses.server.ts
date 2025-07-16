'use server';

import { Logger } from "@/utils/logger"
import { prisma } from "../prisma"
import RepoLicenses from "./RepoLicenses"
import { IWorkExperience, IWorkExperienceFilter } from "@/types/IWorkExperience"
import { deleteFile, uploadImage } from "@/utils/file.server"
import { ILicense, ILicenseFilter, ILicenseSortableProperties } from "@/types/ILicense";
import { ArrayOrder } from "@/lib/array";

export const getAll = RepoLicenses.getAll;
export const getOne = RepoLicenses.getOne;

export async function saveOrUpdate(data: Omit<ILicense, 'id'> & { id?: ILicense['id'] }) {
  const { id, ...values } = data;
  if(typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
} 

export async function save(data: Omit<ILicense,'id'>) {
  let logoPath: string|undefined|null;
  let logoUploaded = false;
  try {
    if(data.logo instanceof File) {
      const upload = await uploadImage(data.logo, `${Date.now()}_license_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }
    const license = await prisma.license.create({
      data: {
        name: data.name,
        orgName: data.orgName,
        startDate_month: data.startDate_month,
        startDate_year: data.startDate_year,
        endDate_month: data.endDate_month,
        endDate_year: data.endDate_year,
        hidden: data.hidden,
        logo: logoPath,
        credentialId: data.credentialId,
        credentialUrl: data.credentialUrl,
      }
    })
    if(!license) throw new Error(`license not saved`);
  
    return license;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'license save error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'license delete logo error');
      }
    }

    return false;
  }
}

export async function update(id: number, data: Omit<ILicense,'id'>) {
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
      const upload = await uploadImage(data.logo, `${Date.now()}_license_logo`);
      if(upload.success) {
        logoUploaded = true;
        logoPath = upload.path;
      }
    } else {
      logoPath = data.logo;
    }
    const license = await prisma.license.update({
      data: {
        name: data.name,
        orgName: data.orgName,
        startDate_month: data.startDate_month,
        startDate_year: data.startDate_year,
        endDate_month: data.endDate_month,
        endDate_year: data.endDate_year,
        hidden: data.hidden,
        logo: logoPath,
        credentialId: data.credentialId,
        credentialUrl: data.credentialUrl,
      },
      where: {
        id,
      },
    })
    if(!license) throw new Error(`license not updated`);

    if(oldLogoPath) {
      try {
        await deleteFile(oldLogoPath);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete old logo error');
      }
    }
  
    return license;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'license update error');

    // delete uploaded image
    if(logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (error: any) {
        let message = 'unknown';
        if(typeof error == 'string') message = error;
        else if(error.message) message = error.message;

        Logger.error(message, 'license delete logo error');
      }
    }

    return false;
  }
}

export async function remove(id: number) {
  try {
    const license = await prisma.license.delete({
      where: {
        id,
      },
    })
    if(!license) throw new Error(`license not deleted`);

    if(license.logo) {
      try {
        await deleteFile(license.logo);
      } catch (error: any) {
        // catch error, ignore if fail (only logging)
        Logger.error(error, 'delete logo error');
      }
    }
  
    return license;
  } catch(error: any) {
    let message = 'unknown';
    if(typeof error == 'string') message = error;
    else if(error.message) message = error.message;

    Logger.error(message, 'license remove error');

    return false;
  }
}

export async function getAllByFilter(filter: ILicenseFilter, offset = 0, limit = 0, order?: ArrayOrder, orderBy?: ILicenseSortableProperties) {
  try {
    const licenses = await prisma.license.findMany({
      skip: offset,
      take: limit > 0 ? limit : undefined,
      where: {
        OR: [
          {
            name: {
              contains: filter.q,
            }
          },
          {
            orgName: {
              contains: filter.q,
            }
          }
        ],
      },
      orderBy: (
        orderBy == 'name' ? ({ name: order })
        : orderBy == 'issueDate' ? ([
          {
            startDate_year: order,
          }, {
            startDate_month: order,
          }
        ]) : orderBy == 'expirationDate' ? ([
          {
            endDate_year: order,
          }, {
            endDate_month: order,
          }
        ]) : undefined
      ),
    })
    if(!licenses) throw Error(`any licenses not found`)
      
    Logger.info(`"${licenses.length}" data loaded!`, 'licenses getAllByFilter')
    return licenses
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'licenses getAllByFilter error')

    throw new Error(message);
  }
}


export async function getCountByFilter(filter: ILicenseFilter) {
  try {
    const licenses = await prisma.license.count({
      where: {
        OR: [
          {
            name: {
              contains: filter.q,
            }
          },
          {
            orgName: {
              contains: filter.q,
            }
          }
        ],
      }
    })
      
    Logger.info(`"${licenses}" licenses counted!`, 'licenses getCountByFilter')
    return licenses
  } catch(error: any) {
    let message = 'unknown'
    if(typeof error == 'string') message = error
    else if(error.message) message = error.message

    Logger.error(message, 'licenses getCountByFilter error')

    throw new Error(message);
  }
}
