import { Image } from "@/components/image/image";
import { FileUploadType, UploadProps } from "@/types/IFileUpload";
import Box, { BoxProps } from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Typography from "@mui/material/Typography";
import { UploadAvatar } from "../../inputs/UploadAvatar";
import FormHelperText from "@mui/material/FormHelperText";

type Props = BoxProps;

export function UploadProfilePicture({
  ...rest
}: Props) {
  //TODO - change to support react-hook-form 
  const [value, setValue] = useState<FileUploadType>()

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    setValue(file);
  }

  return (
    <Box {...rest}>
      <UploadAvatar value={value} error={false} onDrop={onDrop}/>

      <FormHelperText error={false} sx={{ textAlign: 'center' }}/>
    </Box>
  )
}