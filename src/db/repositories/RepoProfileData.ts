import { IProfile, IProfileProfessional } from "@/types/IProfile"
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory"
import { prisma } from "@/db/prisma"
import { parseJSON, toJSON } from "@/lib/json"
import { getErrorMessage } from "@/utils/errorMessage"
import { Logger } from "@/utils/logger"

async function getOne<T>(data_name: string, fallback_value?: T) {
  try {
    const value = await prisma.profile_data.findFirst({
      where: {
        data_name,
      }
    });
    if (!value || !value.data_value) throw Error(`profile_data '${data_name}' not found`);

    return value.data_value as T;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(error, `profile data getOne "${data_name}"`);
    if (fallback_value === undefined) throw new Error(message);

    return fallback_value;
  }
}

async function getJSONData<T>(data_name: string, fallback_value?: T) {
  try {
    const jsonData = await getOne(data_name, toJSON(fallback_value));
    return parseJSON<T>(jsonData);
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(error, `profile data getJSONData "${data_name}"`);
    if (fallback_value === undefined) throw new Error(message);

    return fallback_value;
  }
}

async function getAll(force_return = false) {
  const fallback_value = EMPTY_PROFILE_DATA;
  try {
    const hireable = String(fallback_value.hireable); // optional, return default value
    const lastUpdated = force_return ? fallback_value.lastUpdated?.toISOString() : undefined;
    const profileData: IProfile = {
      name: await getOne('name', force_return ? fallback_value.name : undefined),
      profile_picture: await getOne('profile_picture', force_return ? fallback_value.profile_picture : undefined),
      email: await getOne('email', force_return ? fallback_value.email : undefined),
      address: await getOne('address', force_return ? fallback_value.address : undefined),
      headline: await getOne('headline', force_return ? fallback_value.headline : undefined),
      phone: await getOne('phone', force_return ? fallback_value.phone : undefined),
      intro: await getOne('intro', force_return ? fallback_value.intro : undefined),
      hireable: (await getOne('hireable', hireable)) == 'true',
      socialLinks: {
        codepen: await getOne('socialLinks.codepen', force_return ? fallback_value.socialLinks.codepen : undefined),
        github: await getOne('socialLinks.github', force_return ? fallback_value.socialLinks.github : undefined),
        linkedin: await getOne('socialLinks.linkedin', force_return ? fallback_value.socialLinks.linkedin : undefined),
        website: await getOne('socialLinks.website', force_return ? fallback_value.socialLinks.website : undefined),
      },
      professional: await getProfessionalData(force_return),
      lastUpdated: new Date(await getOne('lastUpdated', lastUpdated)),
    };

    return profileData;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'profile data getAll');
    if (!force_return) throw new Error(message);

    return fallback_value;
  }
}

async function getProfessionalData(force_return = false) {
  const fallback_value = EMPTY_PROFILE_DATA.professional;
  try {
    const professionalData: IProfileProfessional = {
      languages: await getJSONData('professional.languages', force_return ? fallback_value.languages : undefined),
      job_industry: await getJSONData('professional.job_industry', force_return ? fallback_value.job_industry : undefined),
      professions: await getJSONData('professional.professions', force_return ? fallback_value.professions : undefined),
      skills: await getJSONData('professional.skills', force_return ? fallback_value.skills : undefined),
      last_education: await getOne('professional.last_education', force_return ? fallback_value.last_education : undefined),
      managed_people: await getOne('professional.managed_people', force_return ? fallback_value.managed_people : undefined),
      status: await getOne('professional.status', force_return ? fallback_value.status : undefined),
      year_of_experience: await getOne('professional.year_of_experience', force_return ? fallback_value.year_of_experience : undefined),
      relevant_career_year_of_experience: await getOne('professional.relevant_career_year_of_experience', force_return ? fallback_value.relevant_career_year_of_experience : undefined),
    };

    return professionalData;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'profile data getAll');
    if (!force_return) throw new Error(message);

    return fallback_value;
  }
}

export default {
  getOne,
  getJSONData,
  getAll,
  getProfessionalData,
}
