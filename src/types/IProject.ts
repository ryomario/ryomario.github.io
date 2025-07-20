import { Project, ProjectPreview, ProjectTag } from "@/generated/prisma";

export type IProject = Project & {
  previews: (ProjectPreview['url'] | File)[];
  tags: ProjectTag['tag_name'][];
}

export type IProjectFilter = {
  q?: string;
  tags?: IProject['tags'];
  published?: boolean;
}