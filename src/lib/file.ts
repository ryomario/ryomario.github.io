import { ExtendFile } from "@/types/IFileUpload";

export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  try {
    // Fetch the image from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const blob = await response.blob();
    
    // Create a File object from the blob
    return new File([blob], filename, { type: mimeType || blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw error;
  }
}

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split('/').pop();
}

export function fileTypeByUrl(fileUrl: string) {
  if(!fileUrl) return '';
  return fileUrl.split('.').pop();
}

export function fileData(file: File | string) {
  if(typeof file === 'string') {
    return {
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
      size: undefined,
      path: file,
      lastModified: undefined,
      lastModifiedDate: undefined,
    }
  }

  return {
    preview: (file as ExtendFile).preview,
    name: file.name,
    type: file.type,
    size: file.size,
    path: (file as ExtendFile).path,
    lastModified: file.lastModified,
    lastModifiedDate: (file as ExtendFile).lastModifiedDate,
  }
}

const FILE_SIZE_UNITS = ['b','Kb','Mb','Gb','Tb','Pb','Eb','Zb','Yb'] as const;

export type IFileSizeUnit = (typeof FILE_SIZE_UNITS)[number];

/**
 * 
 * @param filesize filesize in units set from param "from"
 * @param to unit size of the result, default to `'b'`.
 * @param from unit size of the "filesize" param, default to `'b'`.
 * @returns 
 */
export function convertFilesize(filesize: number, to: IFileSizeUnit = 'b', from: IFileSizeUnit = 'b'): number {
  if(typeof filesize !== 'number' || Number.isNaN(filesize)) {
    return 0;
  }

  const baseValue = 1024;
  const fromIndex = FILE_SIZE_UNITS.findIndex(d => d === from);
  const toIndex = FILE_SIZE_UNITS.findIndex(d => d === to);
  if(fromIndex == -1 || toIndex == -1) {
    return 0;
  }

  const indexDiff = toIndex - fromIndex;
  
  const result = (filesize / baseValue ** indexDiff);

  return result;
}

export function formatFilesize(filesize: number, unit: IFileSizeUnit = 'b'): string {
  if(typeof filesize !== 'number' || Number.isNaN(filesize)) {
    return '0 bytes';
  }

  const decimal = 2;
  const baseValue = 1024;
  const fromIndex = FILE_SIZE_UNITS.findIndex(d => d === unit);
  if(fromIndex == -1) {
    return '0 bytes';
  }
  const units = FILE_SIZE_UNITS.slice(fromIndex);

  const index = Math.floor(Math.log(filesize) / Math.log(baseValue));

  const result = parseFloat((filesize / baseValue ** index).toFixed(decimal));

  return `${result} ${units[index]}`;
}