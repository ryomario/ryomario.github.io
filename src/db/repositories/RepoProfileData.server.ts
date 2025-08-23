"use server"

import { prisma } from "@/db/prisma";
import RepoProfileData from "@/db/repositories/RepoProfileData";
import { toJSON } from "@/lib/json";
import { IProfileForm, IProfileProfessional, IProfileSocialLinks } from "@/types/IProfile";
import { getErrorMessage } from "@/utils/errorMessage";
import { deleteFile, uploadImage } from "@/utils/file.server";
import { Logger } from "@/utils/logger";

export const getAll = RepoProfileData.getAll
export const getOne = RepoProfileData.getOne
export const getJSONData = RepoProfileData.getJSONData

export async function updateData<T, KEY extends string = string>(name: KEY, value: T): Promise<boolean> {
  try {
    const values = [
      [name, value],
      ['lastUpdated', new Date().toISOString()],
    ];

    const query = `
      INSERT INTO profile_data(data_name, data_value)
      VALUES ${values.map(([data_name, data_value]) => `('${data_name}', '${data_value}')`).join(', ')}
      ON CONFLICT(data_name)
      DO UPDATE SET
        data_value = excluded.data_value
      WHERE excluded.data_name = profile_data.data_name;
    `;
    const changes = await prisma.$executeRawUnsafe(query);

    if (changes <= 0) throw Error(`No changes`);

    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'updateData');

    throw new Error(message);
  }
}

export async function updateProfileData(data: IProfileForm) {
  let profile_picture: string = '';
  let profile_picture_uploaded = false;

  try {
    if (data.profile_picture instanceof File) {
      const uploadReturn = await uploadImage(data.profile_picture, `profile_${Date.now()}`, 100);
      profile_picture_uploaded = uploadReturn.success;
      profile_picture = uploadReturn.path;
    } else if (typeof data.profile_picture === 'string') {
      profile_picture = data.profile_picture;
    }

    const oldProfilePic = await RepoProfileData.getOne('profile_picture', '');

    const values = [
      ['name', data.name],
      ['profile_picture', profile_picture],
      ['email', data.email],
      ['address', data.address],
      ['headline', data.headline],
      ['phone', data.phone],
      ['intro', data.intro],
      ['hireable', String(data.hireable)],
      ['lastUpdated', new Date().toISOString()],
    ];

    const query = `
      INSERT INTO profile_data(data_name, data_value)
      VALUES ${values.map(([data_name, data_value]) => `('${data_name}', '${data_value}')`).join(', ')}
      ON CONFLICT(data_name)
      DO UPDATE SET
        data_value = excluded.data_value
      WHERE excluded.data_name = profile_data.data_name;
    `;
    const changes = await prisma.$executeRawUnsafe(query);

    if (changes <= 0) throw Error(`No changes`);

    if (oldProfilePic && profile_picture && oldProfilePic != profile_picture) {
      await deleteFile(oldProfilePic);
    }

    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    if (profile_picture_uploaded) {
      try {
        await deleteFile(profile_picture);
      } catch (errorDelete) {
        Logger.error(getErrorMessage(errorDelete), 'updateProfileData error > delete file');
      }
    }

    Logger.error(message, 'updateProfileData error');

    throw new Error(message);
  }
}

export async function updateProfileSocialLinks(data: IProfileSocialLinks) {
  try {
    const values = [
      ['socialLinks.codepen', data.codepen],
      ['socialLinks.github', data.github],
      ['socialLinks.linkedin', data.linkedin],
      ['socialLinks.website', data.website],
      ['lastUpdated', new Date().toISOString()],
    ];

    const query = `
      INSERT INTO profile_data(data_name, data_value)
      VALUES ${values.map(([data_name, data_value]) => `('${data_name}', '${data_value}')`).join(', ')}
      ON CONFLICT(data_name)
      DO UPDATE SET
        data_value = excluded.data_value
      WHERE excluded.data_name = profile_data.data_name;
    `;
    const changes = await prisma.$executeRawUnsafe(query);

    if (changes <= 0) throw Error(`No changes`);

    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'updateProfileSocialLinks error');

    throw new Error(message);
  }
}

export async function updateProfileProfessional(data: IProfileProfessional) {
  try {
    const values = [
      ['professional.languages', toJSON(data.languages)],
      ['professional.job_industry', toJSON(data.job_industry)],
      ['professional.professions', toJSON(data.professions)],
      ['professional.skills', toJSON(data.skills)],
      ['professional.last_education', data.last_education],
      ['professional.managed_people', data.managed_people],
      ['professional.status', data.status],
      ['professional.year_of_experience', data.year_of_experience],
      ['professional.relevant_career_year_of_experience', data.relevant_career_year_of_experience],
      ['lastUpdated', new Date().toISOString()],
    ];

    const query = `
      INSERT INTO profile_data(data_name, data_value)
      VALUES ${values.map(([data_name, data_value]) => `('${data_name}', '${data_value}')`).join(', ')}
      ON CONFLICT(data_name)
      DO UPDATE SET
        data_value = excluded.data_value
      WHERE excluded.data_name = profile_data.data_name;
    `;
    const changes = await prisma.$executeRawUnsafe(query);

    if (changes <= 0) throw Error(`No changes`);

    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'updateProfileProfessional error');

    throw new Error(message);
  }
}
