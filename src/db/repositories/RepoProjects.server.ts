"use server"

import { IProject } from "@/types/IProject"
import { prisma } from "../prisma"
import RepoProjects from "./RepoProjects"
import { Logger } from "@/utils/logger"
import { getErrorMessage } from "@/utils/errorMessage"
import { deleteFile, uploadImage } from "@/utils/file.server"
import { ProjectPreview } from "@/generated/prisma"

export const getAll = RepoProjects.getAll
export const getOne = RepoProjects.getOne
export const getAllTags = RepoProjects.getAllTags

export async function saveOrUpdate(data: Omit<IProject, 'id'> & { id?: IProject['id'] }) {
  const { id, ...values } = data;
  if (typeof id === 'undefined' || id === null) {
    return await save(values);
  } else {
    return await update(id, values);
  }
}

export async function save(data: Omit<IProject, 'id'>): Promise<IProject> {
  try {
    const previews = await uploadImagePreviews(data.previews);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        desc: data.desc,
        previews: {
          createMany: {
            data: previews.map((url, order) => ({
              url,
              order,
            })),
          },
        },
        tags: {
          connectOrCreate: data.tags.map((tag_name) => ({
            where: { tag_name },
            create: { tag_name },
          }))
        },
        createdAt: data.createdAt,
        published: data.published,
        updatedAt: data.updatedAt,
        link_repo: data.link_repo ?? null,
        link_demo: data.link_demo ?? null,
      },
      include: {
        tags: true,
        previews: true,
      }
    });
    if (!project) throw Error(`project not saved`);

    return {
      ...project,
      previews: project.previews.map(({ url }) => url),
      tags: project.tags.map(({ tag_name }) => tag_name),
    };
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'project save error');

    throw new Error(message);
  }
}

export async function update(id: number, data: Omit<IProject, 'id'>): Promise<IProject> {
  const unusedPreviews: ProjectPreview['id'][] = [];
  try {
    const previews = await uploadImagePreviews(data.previews);

    const old_project = await prisma.project.findFirst({
      where: {
        id,
      },
      include: {
        previews: true,
      },
    });
    if(!old_project) throw new Error('data not found');

    if (old_project.previews.length > 0) {
      for (const preview of old_project.previews) {
        if (previews.findIndex(url => url == preview.url) == -1) {
          // will be deleted after update success
          unusedPreviews.push(preview.id);
        }
      }
    }
    const project = await prisma.project.update({
      data: {
        title: data.title,
        desc: data.desc,
        previews: {
          upsert: previews.map((url, order) => ({
            update: { order },
            create: { url, order },
            where: { url },
          })),
        },
        tags: {
          set: [],
          connectOrCreate: data.tags.map((tag_name) => ({
            where: { tag_name },
            create: { tag_name },
          }))
        },
        published: data.published,
        updatedAt: data.updatedAt,
        link_repo: data.link_repo ?? null,
        link_demo: data.link_demo ?? null,
      },
      include: {
        tags: true,
        previews: true,
      },
      where: {
        id,
      }
    });
    if (!project) throw Error(`project not updated`);

    // remove project previews
    for (const previewId of unusedPreviews) {
      try {
        await removeProjectPreview(previewId);
      } catch (error) {
        const message = getErrorMessage(error);
        Logger.error(message, 'project update error > removeProjectPreview');
      }
    }

    return {
      ...project,
      previews: project.previews.map(({ url }) => url),
      tags: project.tags.map(({ tag_name }) => tag_name),
    };
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'project update error');

    throw new Error(message);
  }
}

export async function remove(id: IProject['id']): Promise<IProject> {
  try {
    const project = await prisma.project.delete({
      where: {
        id,
      },
      include: {
        tags: true,
        previews: true,
      }
    });
    if (!project) throw Error(`project with id "${id}" not removed`);

    try {
      if (project.previews.length > 0) {
        for (const preview of project.previews) {
          // delete old image
          await removeProjectPreview(preview.id);
        }
      }
    } catch (error: any) {
      const message = getErrorMessage(error);
      Logger.error(message, 'project remove error > removeProjectPreview');
    }

    return {
      ...project,
      previews: project.previews.map(({ url }) => url),
      tags: project.tags.map(({ tag_name }) => tag_name),
    };
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'project remove error');

    throw new Error(message);
  }
}

export async function removeProjectPreview(preview_id: number) {
  try {
    const preview = await prisma.projectPreview.delete({
      where: {
        id: preview_id,
      },
    });
    if (!preview) throw Error(`preview not removed`);

    try {
      if (preview.url) {
        await deleteFile(preview.url);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      Logger.error(message, 'projects removeProjectPreview error deleteFile');
    }

    return preview;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'projects removeProjectPreview error');

    throw new Error(message);
  }
}

async function uploadImagePreviews(previews: IProject['previews']): Promise<ProjectPreview['url'][]> {
  const uploadedUrls: {
    url: ProjectPreview['url'];
    newUpload: boolean;
  }[] = [];

  try {
    if (!previews.length) {
      throw Error('At least add an image preview');
    }

    let timestamp = Date.now();
    for (const image of previews) {
      let image_url: string;
      let uploaded = false;
      if (image instanceof File) {
        const upload = await uploadImage(image, `project_previews/${timestamp++}`);
        image_url = upload.path;
        uploaded = true;
      } else {
        image_url = image;
      }
      uploadedUrls.push({ url: image_url, newUpload: uploaded });
    }

    return uploadedUrls.map(({ url }) => url);
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'projects uploadImagePreviews error');

    for (const { newUpload, url } of uploadedUrls) {
      if (newUpload) {
        try {
          await deleteFile(url);
        } catch (error) {
          Logger.error(getErrorMessage(error), 'projects uploadImagePreviews error > delete file');
        }
      }
    }

    throw new Error(message);
  }
}

export async function getCountAll() {
  try {
    const projects = await prisma.project.count()
      
    Logger.info(`"${projects}" projects counted!`, 'projects getCountAll')
    return projects
  } catch(error) {
    const message = getErrorMessage(error);
    Logger.error(message, 'projects getCountAll error')

    throw new Error(message);
  }
}

