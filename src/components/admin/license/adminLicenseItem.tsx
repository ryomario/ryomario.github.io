import IconButton from "@mui/material/IconButton";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import RouterLink from "next/link";
import { CustomPopover } from "../custom/popover/popover";
import { usePopover } from "../custom/popover/hooks";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ILicense } from "@/types/ILicense";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { fileData } from "@/lib/file";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import { getMonthName } from "@/lib/date";

type Props = {
  data: ILicense;
  editHref: string;
  onDelete: () => void;
}

export function AdminLicenseItem({
  data,
  editHref,
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
        {
          !!data.credentialUrl && (
            <li>
              <MenuItem component={RouterLink} target="_blank" href={data.credentialUrl} onClick={() => menuActions.onClose()}>
                <VisibilityIcon />
                View Credential
              </MenuItem>
            </li>
          )
        }
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

  return (
    <>
      <TableRow>
        <TableCell>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Avatar
              alt={data.orgName}
              src={data.logo ? fileData(data.logo).path : undefined}
              variant="rounded"
              sx={{ width: 48, height: 48 }}
            >
              <WorkspacePremiumIcon />
            </Avatar>

            <ListItemText
              sx={{ m: 0, ml: 2 }}
              primary={
                !!data.credentialUrl
                ? <Link component={RouterLink} target="_blank" href={data.credentialUrl} color="inherit">{data.name}</Link>
                : data.name
              }
              secondary={data.orgName}
              slotProps={{
                primary: { typography: 'subtitle1' },
                secondary: {
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                },
              }}
            />
          </Box>
        </TableCell>
        <TableCell>{`${getMonthName(data.startDate_month, true)} ${data.startDate_year}`}</TableCell>
        <TableCell>{(data.endDate_month && data.endDate_year) ? `${getMonthName(data.endDate_month, true)} ${data.endDate_year}` : 'No Expiration Date'}</TableCell>
        <TableCell>
          <IconButton onClick={menuActions.onOpen}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {renderMenuActions()}
    </>
  );
}