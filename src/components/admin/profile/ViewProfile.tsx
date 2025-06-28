'use client';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { UploadProfilePicture } from "./inputs/UploadProfilePicture";

export function ViewProfile() {
  return (
    <form>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Chip
              variant="filled"
              size="small"
              label="Hireable"
              color="success"
              sx={{ position: 'absolute', top: 24, right: 24 }}
            />
            <Box sx={{ mb: 5 }}>
              <UploadProfilePicture />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          right
        </Grid>
      </Grid>
    </form>
  )
}