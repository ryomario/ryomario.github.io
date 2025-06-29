import { SxProps, Theme } from "@mui/material/styles";
import type { DropzoneOptions } from "react-dropzone";

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemoveAll?: () => void;
  onRemove?: (file: File | string) => void;
}

export interface ExtendFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}