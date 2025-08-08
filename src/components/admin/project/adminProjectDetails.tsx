import Grid from "@mui/material/Grid";

import { IProject } from "@/types/IProject";
import { GalleryHorizontalScroll } from "@/components/reusable/images/galleryHorizontalScroll";
import { fileData } from "@/lib/file";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { date2localeString } from "@/lib/date";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import RouterLink from "next/link";

import EditIcon from '@mui/icons-material/Edit';
import { AdminRoute } from "@/types/EnumAdminRoute";

type Props = {
  data: IProject;
}

export function AdminProjectDetails({ data }: Props) {
  const renderLabel = () => (
    <Chip variant="filled" size="small" color={data.published ? 'info' : 'error'} label={data.published ? 'Published' : 'Not Published'} />
  );
  const renderLink = (link?: string | null) => link && (
    <Link href={link} target="_blank" underline="hover" color="textDisabled" typography="caption">{link}</Link>
  );
  const renderTags = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {data.tags.map(tag => (
        <Chip key={tag} label={tag} size="small" />
      ))}
    </Box>
  );
  return (
    <Grid container spacing={{ xs: 3, md: 5, lg: 8 }} mt={3}>
      <Grid size={12}>
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Stack gap={1} alignItems="flex-start">
            {renderLabel()}
            <Typography variant="h5">{data.title}</Typography>
            <Typography variant="caption" color="textDisabled">Last updated at {date2localeString(data.updatedAt)}</Typography>
          </Stack>
          <Stack direction="row" alignItems="flex-start">
            <Button
              variant="contained"
              color="warning"
              endIcon={<EditIcon />}
              LinkComponent={RouterLink}
              href={`${AdminRoute.PROJECT_EDIT}/${data.id}`}
            >Edit</Button>
          </Stack>
        </Stack>
        <GalleryHorizontalScroll images={data.previews.map(preview => fileData(preview).path ?? '')} />
      </Grid>
      <Grid size={{ xs: 12, sm: 5, md: 4 }}>
        <Card variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Stack spacing={0.5}>
              <Typography variant="body1">Since</Typography>
              <Typography variant="caption" color="textDisabled">{date2localeString(data.createdAt)}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="body1">Last update</Typography>
              <Typography variant="caption" color="textDisabled">{date2localeString(data.updatedAt)}</Typography>
            </Stack>
            {data.link_repo && (
              <Stack spacing={0.5}>
                <Typography variant="body1">Repository</Typography>
                {renderLink(data.link_repo)}
              </Stack>
            )}
            {data.link_demo && (
              <Stack spacing={0.5}>
                <Typography variant="body1">Demo</Typography>
                {renderLink(data.link_demo)}
              </Stack>
            )}
            <Stack spacing={0.5}>
              <Typography variant="body1">Tags</Typography>
              {renderTags()}
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 7, md: 8 }}>
        <Card>
          <CardHeader title="Description" />
          <CardContent>{data.desc}</CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}