import { FileUploadType } from "@/types/IFileUpload";
import Box, { BoxProps } from "@mui/material/Box";
import React, { useState } from "react";
import { UploadAvatar } from "../../inputs/file/UploadAvatar";
import { HelperText } from "../../inputs/HelperText";
import { convertFilesize, formatFilesize } from "@/lib/file";
import Typography from "@mui/material/Typography";

const MAX_UPLOAD_SIZE = convertFilesize(3,'b','Mb'); // 3 Mb in bytes

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
      <UploadAvatar
        value={value}
        error={false}
        onDrop={onDrop}
        maxSize={MAX_UPLOAD_SIZE}
        helperText={
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'center',
              color: 'text.disabled',
            }}
          >
            Allowed all image files
            <br />max size of {formatFilesize(MAX_UPLOAD_SIZE)}
          </Typography>
        }
      />

      <HelperText errorMessage={undefined}  sx={{ textAlign: 'center' }}/>
    </Box>
  )
}