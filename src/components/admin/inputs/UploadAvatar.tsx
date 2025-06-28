import { Image } from "@/components/image/image";
import { UploadProps } from "@/types/IFileUpload";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Typography from "@mui/material/Typography";

export function UploadAvatar({
  sx,
  error,
  value,
  disabled,
  helperText,
  className,
  ...rest
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: { 'image/*': [] },
    ...rest,
  });

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if(typeof value === 'string') {
      setPreview(value);
    } else if(value instanceof File) {
      setPreview(URL.createObjectURL(value));
    }
  },[value]);

  const renderPreview = () => {
    if(!hasFile) {
      return null;
    }
    return <Image alt="Avatar" src={preview} sx={{ width: 1, height: 1,borderRadius: '100%' }}/>
  };

  const renderPlaceholder = () => (
    <Box
      className="upload-placeholder"
      sx={(theme) => ({
        top: 0,
        left: 0,
        gap: 1,
        width: 1,
        height: 1,
        zIndex: 9,
        display: 'flex',
        borderRadius: '50%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.disabled',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.grey[500], 0.08),
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': { opacity: 0.72 },
        ...(hasError && {
          color: 'error.main',
          bgcolor: alpha(theme.palette.error.main, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: alpha(theme.palette.grey[500], 0.64),
        }),
      })}
    >
      <AddAPhotoIcon sx={{ width: 32 }}/>

      <Typography variant="caption">{hasFile ? 'Update photo' : 'Upload photo'}</Typography>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview()}
      {renderPlaceholder()}
    </Box>
  );

  return <>
    <Box
      {...getRootProps()}
      className={className}
      sx={[
        (theme) => ({
          p: 1,
          m: 'auto',
          width: 144,
          height: 144,
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '50%',
          border: `1px dashed ${theme.palette.grey[500]}`,
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
          ...(hasError && { borderColor: 'error.main' }),
          ...(hasFile && {
            ...(hasError && { bgcolor: alpha(theme.palette.error.main, 0.08) }),
            '&:hover .upload-placeholder': { opacity: 1 },
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <input {...getInputProps()}/>

      {renderContent()}
    </Box>
    
    {!!helperText && helperText}

    {/** @TODO display file errors */}
    {!!fileRejections.length && (
      <ul>
        {fileRejections.map((r, i) => <li key={`errors-${i}`}>{r.file.name} Errors: {r.errors.map((error, j) => <div key={`errors-${i}-${j}`}>{error.message}</div>)}</li>)}
      </ul>
    )}
  </>
}