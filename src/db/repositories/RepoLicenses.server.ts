'use server';

import { IFormLicense, ILicense, ILicenseFilter } from "@/types/ILicense";
import { getErrorMessage } from "@/utils/errorMessage";
import { deleteFile, uploadImage } from "@/utils/file.server";
import { Logger } from "@/utils/logger";
import { prisma } from "../prisma";
import RepoLicenses from "./RepoLicenses";

const logoDir = 'logo_licenses';

export const getAll = RepoLicenses.getAll;
export const getOne = RepoLicenses.getOne;

export async function saveOrUpdate(data: IFormLicense) {
  const { id, ...values } = data;
  if (typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
}

export async function save(data: Omit<IFormLicense, 'id'>): Promise<ILicense> {
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
    if (!license) throw new Error(`license not saved`);

    return license;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'license save error');

    // delete uploaded image
    if (logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (errorDelete) {
        Logger.error(getErrorMessage(errorDelete), 'license delete logo error');
      }
    }

    throw new Error(message);
  }
}

export async function update(id: number, data: Omit<IFormLicense, 'id'>): Promise<ILicense> {
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
    });
    if (!license) throw new Error(`license not updated`);

    if (oldLogoPath) {
      try {
        await deleteFile(oldLogoPath);
      } catch (error) {
        // catch error, ignore if fail (only logging)
        Logger.error(getErrorMessage(error), 'delete old logo error');
      }
    }

    return license;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'license update error');

    // delete uploaded image
    if (logoUploaded && typeof logoPath === 'string') {
      try {
        await deleteFile(logoPath);
      } catch (errorDelete) {
        Logger.error(getErrorMessage(errorDelete), 'license delete logo error');
      }
    }

    throw new Error(message);
  }
}

export async function remove(id: number): Promise<ILicense> {
  try {
    const license = await prisma.license.delete({
      where: {
        id,
      },
    })
    if (!license) throw new Error(`license not deleted`);

    if (license.logo) {
      try {
        await deleteFile(license.logo);
      } catch (error) {
        // catch error, ignore if fail (only logging)
        Logger.error(getErrorMessage(error), 'delete logo error');
      }
    }

    return license;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'license remove error');

    throw new Error(message);
  }
}

export async function getCountByFilter(filter: ILicenseFilter) {
  try {
    const licenses = (await getAll({ filter })).length;

    Logger.info(`"${licenses}" licenses counted!`, 'licenses getCountByFilter');
    return licenses;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'licenses getCountByFilter error');

    throw new Error(message);
  }
}
