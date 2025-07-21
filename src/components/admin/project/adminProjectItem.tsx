import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fileData } from "@/lib/file";
import RouterLink from "next/link";
import Typography from "@mui/material/Typography";
import { CustomPopover } from "../custom/popover/popover";
import { usePopover } from "../custom/popover/hooks";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { IProject } from "@/types/IProject";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import { Image } from "@/components/image/image";

type Props = {
  data: IProject;
  editHref: string;
  detailsHref: string;
  onDelete: () => void;
}

export function AdminProjectItem({
  data,
  editHref,
  detailsHref,
  onDelete,
}: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <VisibilityIcon />
            View
          </MenuItem>
        </li>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={menuActions.onClose}>
            <EditIcon />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return <>
    <CardContainer
      className={menuActions.open ? '--options-open' : ''}
    >
      <CardMedia
        component="img"
        image={fileData(data.previews[0]).path}
        alt={data.title}
      />

      <Overlay>
        <Typography variant="h6" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="body2" sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        }}>
          {data.desc}
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