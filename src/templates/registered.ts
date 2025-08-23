import { IThemeOptions } from "@/types/ITheme";
import { defaultTmplTheme } from "./default/theme";
import RepoTemplates from "@/db/repositories/RepoTemplates";

export const templates = [
  'default',
] as const;

export type TemplateName = (typeof templates)[number];

export async function getActiveTemplate(): Promise<TemplateName> {
  let templateName: TemplateName = templates[0];
  try {
    const activeTemplateIdx = await RepoTemplates.getActiveTemplateId();
    templateName = templates[activeTemplateIdx] ?? templates[0];
  } catch (error) {
    templateName = templates[0];
  }

  return templateName;
}

export function getTemplateTheme(name: TemplateName): IThemeOptions {
  switch (name) {
    case 'default': return defaultTmplTheme;
    default: return defaultTmplTheme;
  }
}