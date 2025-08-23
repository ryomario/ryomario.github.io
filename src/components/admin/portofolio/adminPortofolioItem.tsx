import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon
} from '@mui/icons-material';

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
  setActive: () => Promise<void>;
  isActive?: boolean;
}

export function AdminPortofolioItem({
  name,
  setActive,
  isActive = false,
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
            setActive().then(() => {
              menuActions.onClose();
            })
          }}
          disabled={isActive}
        >
          {!isActive ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />}
          Set active
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return <>
    <CardContainer
      variant="outlined"
      className={menuActions.open ? '--options-open' : ''}
      isActive={isActive}
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

const CardContainer = styled(Card, {
  shouldForwardProp: (prop) => !['isActive'].includes(prop as string),
})<{ isActive?: boolean }>(({ isActive = false, theme }) => ({
  position: 'relative',
  overflow: 'visible',
  ['& > *']: {
    borderRadius: 'inherit',
  },
  transition: 'transform 0.3s ease',
  '&:hover, &.--options-open': {
    transform: 'scale(1.02)',
    '--overlay-opacity': 1,
  },
  ['&::after']: {
    content: '"Active"',
    fontWeight: 'bold',
    '--f': '0.5em',
    position: 'absolute',
    display: isActive ? 'block' : 'none',
    top: 0,
    left: 0,
    lineHeight: 1.8,
    paddingInline: '1lh',
    paddingBottom: 'var(--f)',
    borderImage: 'conic-gradient(#0008 0 0) 51%/var(--f)',
    clipPath: 'polygon(100% calc(100% - var(--f)),100% 100%,calc(100% - var(--f)) calc(100% - var(--f)),var(--f) calc(100% - var(--f)), 0 100%,0 calc(100% - var(--f)),999px calc(100% - var(--f) - 999px),calc(100% - 999px) calc(100% - var(--f) - 999px))',
    transform: 'translate(calc((cos(45deg) - 1)*100%), -100%) rotate(-45deg)',
    transformOrigin: '100% 100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));