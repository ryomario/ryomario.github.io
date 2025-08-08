import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fileData } from "@/lib/file";
import RouterLink from "next/link";
import { AdminRoute } from "@/types/EnumAdminRoute";
import { IEducation } from "@/types/IEducation";

import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import SchoolIcon from '@mui/icons-material/School';

type Props = {
  data: IEducation;
}

export function AdminEducationDetails({ data }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={12} display="flex" gap={3} justifyContent="flex-end" alignItems="center">
        <Chip size="small" color={data.hidden ? 'default' : 'primary'} icon={data.hidden ? <PublicOffIcon/> : <PublicIcon/>} label={data.hidden ? "Not published" : "Published"}/>
        <Button
          variant="contained"
          color="warning"
          endIcon={<EditIcon/>}
          LinkComponent={RouterLink}
          href={`${AdminRoute.EDUCATION_EDIT}/${data.id}`}
        >Edit</Button>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            p: 3,
            mb: 3,
            display: 'flex',
            gap: 2,
          }}
        >
          <Avatar
            alt={data.schoolName}
            src={data.logo ? fileData(data.logo).path : undefined}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          >
            <SchoolIcon />
          </Avatar>
          <Stack spacing={1}>
            <Typography variant="h6">{data.schoolName}</Typography>
            <Typography variant="body2">{data.degree}</Typography>
            {
              !!data.majors.length && data.majors.map((major, i) => (
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
                  {major}
                </Box>
              ))
            }
          </Stack>
        </Card>
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
              <Typography variant="body2">{data.startYear}</Typography>
            </Stack>
          </Box>
          <Box display="flex" gap={1.5}>
            <EventIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">Date ended</Typography>
              <Typography variant="body2">{data.endYear}</Typography>
            </Stack>
          </Box>
          <Box display="flex" gap={1.5}>
            <SchoolIcon fontSize="small"/>
            <Stack flexGrow={1} spacing={0.5}>
              <Typography variant="body2" color="text.disabled">GPA</Typography>
              <Typography variant="body2">{data.gpa ? (data.gpa_scale ? `${data.gpa}/${data.gpa_scale}` : data.gpa): ''}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Stack spacing={1} mb={3}>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body2" color={data.description ? "textPrimary" : "textDisabled"}>{data.description || 'no description'}</Typography>
            </Stack>
            {
              !!data.activities && (
                <Stack spacing={1} mb={3}>
                  <Typography variant="h6">Activities and Societies</Typography>
                  <Typography variant="body2">{data.activities}</Typography>
                </Stack>
              )
            }
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}