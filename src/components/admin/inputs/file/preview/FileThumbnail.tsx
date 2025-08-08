import { fileData, fileFormat } from "@/lib/file";
import { FileThumbnailProps } from "@/types/IFileUpload";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";

import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Tooltip from "@mui/material/Tooltip";

export const thumbnailClasses = {
  root: 'file-thumbnail',
  img: 'file-thumbnail-img',
  icon: 'file-thumbnail-icon',
  removeButton: 'file-thumbnail-removeButton',
  downloadButton: 'file-thumbnail-downloadButton',
}

export const FileThumbnail = forwardRef<HTMLDivElement, FileThumbnailProps>((props, ref) => {
  const { file, tooltip, imageView, slotProps, onDownload, className, onRemove, sx } = props;

  const { icon, removeButton, downloadButton, tooltip: tooltipProps } = slotProps ?? {};

  const { name, path } = fileData(file);

  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  const format = fileFormat(path ?? previewUrl);

  const renderThumbnail = () => (
    <Thumbnail
      ref={ref}
      className={[
        thumbnailClasses.root,
        className,
      ].join(' ')}
      sx={sx}
    >
      {format === 'image' && imageView ? (
        <ItemImage src={previewUrl} className={thumbnailClasses.img} {...slotProps?.img} />
      ) : (
        // TODO - handle other file fomats
        <ItemImage src="/file.svg" className={thumbnailClasses.icon} {...icon} />
      )}

      {onRemove && (
        <IconButton
          size="small"
          onClick={onRemove}
          className={thumbnailClasses.removeButton}
          {...removeButton}
        >
          <CloseIcon fontSize="inherit" color="inherit"/>
        </IconButton>
      )}

      {onDownload && (
        <IconButton
          size="small"
          onClick={onDownload}
          className={thumbnailClasses.downloadButton}
          {...downloadButton}
        >
          <CloudDownloadIcon />
        </IconButton>
      )}
    </Thumbnail>
  );

  if (tooltip) {
    return (
      <Tooltip
        arrow
        title={name}
        {...tooltipProps}
        slotProps={{
          ...tooltipProps?.slotProps,
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: { offset: [0, -12] },
              },
            ],
            ...tooltipProps?.slotProps?.popper,
          }
        }}
      >
        {renderThumbnail()}
      </Tooltip>
    );
  }

  return renderThumbnail();
});

// =========================================

const ItemImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const Thumbnail = styled('span')(({ theme }) => ({
  width: 36,
  height: 36,
  flexShrink: 0,
  alignItems: 'center',
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
}));