import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from "@mui/material/styles";

export function DeleteButtonPreview({ sx, ...rest }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={[
        (theme) => ({
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          color: alpha(theme.palette.common.white, 0.8),
          bgcolor: alpha(theme.palette.grey[900], 0.72),
          '&:hover': { bgcolor: alpha(theme.palette.grey[900], 0.48) },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <CloseIcon sx={{ width: 18, height: 18 }}/>
    </IconButton>
  );
}