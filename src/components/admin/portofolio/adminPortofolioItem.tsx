import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import RouterLink from "next/link";
import Typography from "@mui/material/Typography";
import { CustomPopover } from "../custom/popover/popover";
import { usePopover } from "../custom/popover/hooks";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { TemplateName } from "@/templates/registered";
import { useEffect, useMemo, useState } from "react";
import { generatePreviewWithCache } from "@/utils/imageGeneration.server";
import { Image } from "@/components/image/image";

type Props = {
  name: TemplateName;
}

export function AdminPortofolioItem({
  name,
}: Props) {
  const viewHref = useMemo<string>(() => `${window.location.protocol}//${window.location.host}/en/?tmpl=${name}`, [name]);

  const menuActions = usePopover();

  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const buffer = await generatePreviewWithCache(viewHref, { removeElements: ['nextjs-portal'] });

        // Convert buffer to base64
        const base64 = btoa(
          buffer.reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        setImageSrc(`data:image/png;base64,${base64}`);
      } catch (error) {
        setImageSrc('');
      }
    }

    fetchImage();
  }, []);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={viewHref} onClick={() => menuActions.onClose()}>
            <VisibilityIcon />
            View
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            // onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Set active
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return <>
    <CardContainer
      className={menuActions.open ? '--options-open' : ''}
    >
      <Image
        src={imageSrc}
        ratio="1.91/1"
        alt={name}
      />

      <Overlay>
        <Typography component={RouterLink} href={viewHref} sx={{ color: 'inherit' }} variant="h6" gutterBottom>
          {name}
        </Typography>

        <IconButton color="inherit" onClick={menuActions.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <MoreVertIcon />
        </IconButton>
      </Overlay>
    </CardContainer>

    {renderMenuActions()}
  </>;
}

// styled components

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 'var(--overlay-opacity, 0)',
  transition: 'opacity 0.3s ease',
  padding: '16px',
});

const CardContainer = styled(Card)({
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&:hover, &.--options-open': {
    transform: 'scale(1.02)',
    '--overlay-opacity': 1,
  },
});