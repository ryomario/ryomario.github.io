'use server';

import { getErrorMessage } from "@/utils/errorMessage";
import { Logger } from "@/utils/logger";
import RepoTemplates from "./RepoTemplates";
import * as RepoProfileData_server from "./RepoProfileData.server";
import { IProfile } from "@/types/IProfile";
import { join } from "path";
import { writeFile } from "fs/promises";

export const getActiveTemplateId = RepoTemplates.getActiveTemplateId;
export const getLastOGImageGenerated = RepoTemplates.getLastOGImageGenerated;

export async function setActiveTemplateId(tmplId: number): Promise<boolean> {
  try {
    const result = await RepoProfileData_server.updateData<number, keyof IProfile>('activeTmplId', tmplId);
    if (!result) throw new Error('Internal error');

    Logger.info(`active template id "${tmplId}"`, 'setActiveTemplateId');
    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'setActiveTemplateId');
    throw new Error(message);
  }
}

export async function updateOGImage(file: File): Promise<boolean> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = 'opengraph-image.png';

    const path = join(process.cwd(), "src/app", filename);

    await writeFile(path, buffer);

    const result = await RepoProfileData_server.updateData<string, keyof IProfile>('lastOGImgGenerated', new Date().toISOString());
    if (!result) throw new Error('Internal error');

    Logger.info(`succes`, 'updateOGImage');
    return true;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'updateOGImage');
    throw new Error(message);
  }
}