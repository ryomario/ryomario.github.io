import { Project, ProjectPreview, ProjectTag } from "@/generated/prisma";

export type IProject = Project & {
  previews: ProjectPreview['url'][];
  tags: ProjectTag['tag_name'][];
}

export type IFormProject = Omit<IProject, 'id'|'previews'> & {
  id?: IProject['id'] | null;
  previews: (ProjectPreview['url'] | File)[];
}

export type IProjectFilter = {
  q?: string;
  tags?: IProject['tags'];
  published?: boolean;
}

export type IProjectSortableProperties = 'title' | 'createdAt' | 'updatedAt';