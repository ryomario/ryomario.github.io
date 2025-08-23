import { Logger } from "@/utils/logger";
import { getErrorMessage } from "@/utils/errorMessage";
import RepoProfileData from "./RepoProfileData";
import { IProfile } from "@/types/IProfile";

async function getActiveTemplateId(): Promise<number> {
  try {
    const activeTemplateId = await RepoProfileData.getOne<number, keyof IProfile>('activeTmplId', 0);

    Logger.info(`template id "${activeTemplateId}" loaded!`, 'templates getActiveTemplateId');
    return activeTemplateId;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'templates getActiveTemplateId')

    throw new Error(message);
  }
}

async function getLastOGImageGenerated(): Promise<Date> {
  try {
    const isoString = await RepoProfileData.getOne<string, keyof IProfile>('lastOGImgGenerated');
    const lastGenerated = new Date(isoString);

    Logger.info(`ISO date "${isoString}" loaded!`, 'templates getLastOGImageGenerated');
    return lastGenerated;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'templates getLastOGImageGenerated')

    throw new Error(message);
  }
}

export default {
  getActiveTemplateId,
  getLastOGImageGenerated,
}