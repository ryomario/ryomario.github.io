import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { IconButtonProps } from "@mui/material/IconButton";
import { SxProps, Theme } from "@mui/material/styles";
import { TooltipProps } from "@mui/material/Tooltip";
import React from "react";
import type { DropzoneOptions } from "react-dropzone";

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  thumbnail?: boolean;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemoveAll?: () => void;
  onRemove?: (file: File | string) => void;
  onReordered?: (reordered_files: FilesUploadType) => void;
}

export interface ExtendFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export type FileThumbnailProps = React.ComponentProps<'div'> & {
  tooltip?: boolean;
  file: File | string;
  imageView?: boolean;
  sx?: SxProps<Theme>;
  onDownload?: () => void;
  onRemove?: () => void;
  slotProps?: {
    tooltip?: TooltipProps;
    removeButton?: IconButtonProps;
    downloadButton?: IconButtonProps;
    img?: React.ComponentProps<'img'> & { sx?: SxProps<Theme> },
    icon?: React.ComponentProps<'img'> & { sx?: SxProps<Theme> },
  };
}