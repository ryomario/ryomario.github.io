import { UploadProps } from "@/types/IFileUpload";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import { SingleFilePreview } from "./preview/SingleFilePreview";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DeleteButtonPreview } from "./preview/DeleteButtonPreview";
import FormHelperText from "@mui/material/FormHelperText";
import { RejectionFiles } from "./RejectionFiles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { MultiFilePreview } from "./preview/MultiFilePreview";

export function UploadFile({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  className,
  multiple = false,
  placeholder,
  onReordered,
  ...rest
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...rest,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;
  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1,
        color: 'text.disabled',
      }}
    >
      {placeholder || <>
        <CloudUploadIcon sx={{ width: 28, height: 28 }}/>
        <Typography variant="body2">Upload file</Typography>
      </>}
    </Box>
  );

  const renderMultiPreviews = () => hasFiles && (
    <>
      <MultiFilePreview files={value} thumbnail={thumbnail} onRemove={onRemove} sx={{ my: 3 }} onReordered={onReordered}/>

      {(onRemoveAll || onUpload) && (
        <Box sx={{ gap: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
          {onRemoveAll && (
            <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
              Remove all
            </Button>
          )}

          {onUpload && (
            <Button size="small" variant="contained" onClick={onUpload} startIcon={<CloudUploadIcon/>}>
              Upload
            </Button>
          )}
        </Box>
      )}
    </>
  );

  return (
    <Box
      className={['UploadFile',className].join(' ')}
      sx={[
        { width: 1, position: 'relative' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        {...getRootProps()}
        sx={[
          (theme) => ({
            p: 5,
            outline: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            bgcolor: alpha(theme.palette.grey[500], 0.08),
            border: `1ps dashed ${alpha(theme.palette.grey[500], 0.2)}`,
            transition: theme.transitions.create(['opacity', 'padding']),
            '&:hover': { opacity: 0.72 },
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: alpha(theme.palette.error.main, 0.08),
            }),
            ...(hasFile && { padding: '28% 0' }),
          })
        ]}
      >
        <input {...getInputProps()}/>

        {/* single file */}
        {hasFile ? <SingleFilePreview file={value as File}/> : renderPlaceholder()}
      </Box>

      {/* single file */}
      {hasFile && <DeleteButtonPreview onClick={onDelete}/>}

      {helperText && (
        <FormHelperText error={!!error} sx={{ mx: 1.75 }}>{helperText}</FormHelperText>
      )}

      {!!fileRejections.length && <RejectionFiles files={fileRejections}/>}

      {/* Multi files */}
      {renderMultiPreviews()}
    </Box>
  );
}