import { fileData, formatFilesize } from "@/lib/file";
import { alpha, styled } from "@mui/material/styles";
import React from "react";
import { FileRejection } from "react-dropzone";

type Props = React.ComponentProps<typeof ListRoot> & {
  files?: readonly FileRejection[];
}

export function RejectionFiles({
  files,
  sx,
  className,
  ...rest
}: Props) {
  return (
    <ListRoot
      className={className}
      sx={sx}
      {...rest}
    >
      {files?.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <ListItem key={path}>
            <ItemTitle>{path} - {size ? formatFilesize(size) : ''}</ItemTitle>

            {errors.map((error) => (
              <ItemCaption key={`${path}-${error.code}`}>- {error.message}</ItemCaption>
            ))}
          </ListItem>
        )
      })}
    </ListRoot>
  );
}

const ListRoot = styled('ul')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'column',
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.vars?.palette.error.main}`,
  backgroundColor: alpha(theme.palette.error.main, 0.08),
}));

const ListItem = styled('li')(() => ({ display: 'flex', flexDirection: 'column' }));

const ItemTitle = styled('span')(({ theme }) => ({ ...theme.typography.subtitle2 }));

const ItemCaption = styled('span')(({ theme }) => ({ ...theme.typography.caption }));