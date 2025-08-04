import RepoProfileData from "@/db/repositories/RepoProfileData";
import { IThemeOptions } from "@/types/ITheme";
import { ACTIVE_TEMPlATE_STORE_ID } from "@/types/templates/ITemplate";
import { defaultTmplTheme } from "./default/theme";

export const templates = [
  'default',
] as const;

export type TemplateName = (typeof templates)[number];

export async function getActiveTemplate(): Promise<TemplateName> {
  const activeTemplateIdx = await RepoProfileData.getOne<number>(ACTIVE_TEMPlATE_STORE_ID, 0);
  const templateName: TemplateName = templates[activeTemplateIdx] ?? templates[0];

  return templateName;
}

export function getTemplateTheme(name: TemplateName): IThemeOptions {
  switch(name) {
    case 'default': return defaultTmplTheme;
    default: return defaultTmplTheme;
  }
}