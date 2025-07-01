'use server';

import { convertFilesize, formatFilesize } from "@/lib/file";
import { rm, writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const MAX_FILE_SIZE = convertFilesize(5, 'b', 'Mb'); // 5MB

/**
 * 
 * @param file 
 * @param filename 
 * @param quality Quality, integer 1-100 (optional, default 80)
 * @param allowedTypes optional, default `["image/jpeg", "image/png"]`
 * @returns 
 */
export async function uploadImage(file?: File, filename?: string, quality = 80, allowedTypes = ["image/jpeg", "image/png"]) {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File type not allowed");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (max ${formatFilesize(MAX_FILE_SIZE)})`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Convert to WebP
  const webpBuffer = await sharp(buffer)
    .webp({ quality })
    .toBuffer();

  if(!filename) {
    filename = `${Date.now()}_image_uploaded.webp`
  }

  if(filename.split('.').pop() != 'webp') {
    filename = `${filename}.webp`
  }

  const path = join(process.cwd(), "public/images", filename);
  await writeFile(path, webpBuffer);
  
  return { 
    success: true,
    path: `/images/${filename}`,
  };
}

export async function deleteFile(url_path: string) {
  const path = join(process.cwd(), "public", url_path);
  await rm(path)
}