import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { fileData } from "@/lib/file";
import ListItemText from "@mui/material/ListItemText";
import RouterLink from "next/link";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { CustomPopover } from "../custom/popover/popover";
import { usePopover } from "../custom/popover/hooks";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { IEducation } from "@/types/IEducation";

type Props = {
  data: IEducation;
  editHref: string;
  detailsHref: string;
  onDelete: () => void;
}

export function AdminEducationItem({
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
            <VisibilityIcon/>
            View
          </MenuItem>
        </li>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={menuActions.onClose}>
            <EditIcon/>
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
          <DeleteIcon/>
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderBotSide = () => <>
    <Divider sx={{ borderStyle: 'dashed' }}/>
    <Box
      sx={{
        p: 3,
        pt: 2,
        gap: 1.5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          gap: 0.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.majors.map((major, i) => (
          <Box
            key={`major-${i}`}
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'flex-start',
              typography: 'caption',
            }}
          >
            <SchoolIcon sx={{ fontSize: '1.5em' }}/>
            <Box
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {major}
            </Box>
          </Box>
        ))}
      </Box>

      {!!data.description && (
        <Box
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          <Typography variant="caption">{data.description}</Typography>
        </Box>
      )}
    </Box>
  </>;

  return <>
    <Card>
      <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <MoreVertIcon/>
      </IconButton>

      <Box sx={{ p: 3, pb: 2 }}>
        <Avatar
          alt={data.schoolName}
          src={data.logo ? fileData(data.logo).path : undefined}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        >
          <ApartmentRoundedIcon />
        </Avatar>

        <ListItemText
          sx={{ mb: 1 }}
          primary={
            <Link component={RouterLink} href={detailsHref} color="inherit">{data.schoolName}</Link>
          }
          secondary={data.degree}
          slotProps={{
            primary: { typography: 'subtitle1' },
            secondary: {
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            },
          }}
        />

        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            typography: 'caption',
          }}
        >
          <DateRangeRoundedIcon sx={{ fontSize: '1.5em' }}/>
          {`${data.startYear} - ${data.endYear}`}
        </Box>
      </Box>

      {(!!data.majors.length || !!data.description) && renderBotSide()}
    </Card>

    {renderMenuActions()}
  </>;
}