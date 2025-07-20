import { getWorkEmploymentLabel, IWorkExperience } from "@/types/IWorkExperience";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fileData } from "@/lib/file";
import ListItemText from "@mui/material/ListItemText";
import { getMonthName, monthYearElapsedHuman } from "@/lib/date";
import RouterLink from "next/link";
import { AdminRoute } from "@/types/EnumAdminRoute";

import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

type Props = {
  data: IWorkExperience;
}

export function AdminWorkDetails({ data }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={12} display="flex" gap={3} justifyContent="flex-end" alignItems="center">
        <Chip size="small" color={data.hidden ? 'default' : 'primary'} icon={data.hidden ? <PublicOffIcon/> : <PublicIcon/>} label={data.hidden ? "Not published" : "Published"}/>
        <Button
          variant="contained"
          color="warning"
          endIcon={<EditIcon/>}
          LinkComponent={RouterLink}
          href={`${AdminRoute.WORK_EDIT}/${data.id}`}
        >Edit</Button>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardHeader title={data.jobTitle} sx={{ mb: 3 }}/>

          <CardContent>
            {
              !!data.description && (
                <Stack spacing={1} mb={3}>
                  <Typography variant="h6">Description</Typography>
                  <Typography variant="body2">{data.description}</Typography>
                </Stack>
              )
            }
            {
              !!data.skills.length && (
                <Stack spacing={1} mb={3}>
                  <Typography variant="h6">Skills</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {data.skills.map((skill, i) => (
                      <Chip key={i} label={skill}/>
                    ))}
                  </Box>
                </Stack>
              )
            }
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{
          p: 3,
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
        }}>
          <Box display="flex" gap={1.5}>
            <TodayIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">Date started</Typography>
              <Typography variant="body2">{`${getMonthName(data.startDate_month)} ${data.startDate_year}`}</Typography>
            </Stack>
          </Box>
          <Box display="flex" gap={1.5}>
            <EventIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">Date ended</Typography>
              <Typography variant="body2">{
                (data.endDate_month && data.endDate_year)
                ? `${getMonthName(data.endDate_month)} ${data.endDate_year}`
                : 'Present'
              }</Typography>
            </Stack>
          </Box>
          <Box display="flex" gap={1.5}>
            <AccessTimeFilledIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">Employment type</Typography>
              <Typography variant="body2">{getWorkEmploymentLabel(data.employmentType)}</Typography>
            </Stack>
          </Box>
          <Box display="flex" gap={1.5}>
            <HourglassBottomIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">Experience</Typography>
              <Typography variant="body2">{monthYearElapsedHuman(data.startDate_month, data.startDate_year, data.endDate_month, data.endDate_year)}</Typography>
            </Stack>
          </Box>
        </Card>
        <Card variant="outlined" sx={{
          p: 3,
          mt: 3,
          display: 'flex',
          gap: 2,
        }}>
          <Avatar
            alt={data.companyName}
            src={data.logo ? fileData(data.logo).path : undefined}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          >
            <ApartmentRoundedIcon />
          </Avatar>
          <Stack spacing={1}>
            <Typography variant="h6">{data.companyName}</Typography>
            {
              !!data.location.length && data.location.map((loc, i) => (
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
                  {loc}
                </Box>
              ))
            }
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}