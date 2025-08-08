import { styled, SxProps, Theme } from "@mui/material/styles";
import React from "react";

type Props = React.ComponentProps<'div'> & {
  file: File | string;
  sx?: SxProps<Theme>;
}

export function SingleFilePreview({ file, sx, className, ...rest }: Props) {
  const filename = typeof file === 'string' ? file : file.name;
  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  return (
    <PreviewRoot
      className={['SingleFilePreview',className].join(' ')}
      sx={sx}
    >
      <img alt={filename} src={previewUrl} />
    </PreviewRoot>
  );
}

// Styled components

const PreviewRoot = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  position: 'absolute',
  padding: theme.spacing(1),
  '& > img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
}));