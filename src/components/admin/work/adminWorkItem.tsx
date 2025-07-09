import { IWorkExperience } from "@/types/IWorkExperience"
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { fileData } from "@/lib/file";
import ListItemText from "@mui/material/ListItemText";
import RouterLink from "next/link";
import Link from "@mui/material/Link";
import { getMonthName } from "@/lib/date";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

type Props = {
  data: IWorkExperience;
  editHref: string;
  detailsHref: string;
  onDelete: () => void;
}

export function AdminWorkItem({
  data,
  editHref,
  detailsHref,
  onDelete,
}: Props) {

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
        {data.location.map((location, i) => (
          <Box
            key={`location-${i}`}
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'flex-start',
              typography: 'caption',
            }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: '1.5em' }}/>
            <Box
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
            >
              {location}
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
      <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
        <MoreVertIcon/>
      </IconButton>

      <Box sx={{ p: 3, pb: 2 }}>
        <Avatar
          alt={data.companyName}
          src={data.logo ? fileData(data.logo).path : undefined}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        >
          <ApartmentRoundedIcon />
        </Avatar>

        <ListItemText
          sx={{ mb: 1 }}
          primary={
            <Link component={RouterLink} href={detailsHref} color="inherit">{data.jobTitle}</Link>
          }
          secondary={data.companyName}
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
          {`${getMonthName(data.startDate_month, true)} ${data.startDate_year}`}
          {' - '}
          {(data.endDate_month && data.endDate_year) ? `${getMonthName(data.endDate_month, true)} ${data.endDate_year}` : 'Present'}
        </Box>
      </Box>

      {(!!data.location.length || !!data.description) && renderBotSide()}
    </Card>
  </>;
}