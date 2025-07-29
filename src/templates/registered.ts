import RepoProfileData from "@/db/repositories/RepoProfileData";
import { ACTIVE_TEMPlATE_STORE_ID } from "@/types/templates/ITemplate";

export const templates = [
  'default',
] as const;

export type TemplateName = (typeof templates)[number];

export async function getActiveTemplate(): Promise<TemplateName> {
  const activeTemplateIdx = await RepoProfileData.getOne<number>(ACTIVE_TEMPlATE_STORE_ID, 0);
  const templateName: TemplateName = templates[activeTemplateIdx] ?? templates[0];

  return templateName;
}