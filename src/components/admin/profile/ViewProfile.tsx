'use client';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { UploadProfilePicture } from "./inputs/UploadProfilePicture";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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

            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  // checked={true}
                  // onChange={(event) => {
                  //   console.log(event.target.checked);
                  // }}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Hireable</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Show that you are currently ready to be recruited
                  </Typography>
                </>
              }
              sx={{
                mx: 0,
                mb: 3,
                width: 1,
                justifyContent: 'space-between',
              }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
              }}
            >
              <TextField fullWidth type="text" label="Full name" required/>
              <TextField fullWidth type="email" label="Email address" required/>
              <TextField fullWidth type="text" label="Headline" defaultValue="Web developer" required/>
              <TextField fullWidth type="text" label="Current Residence" helperText="Please input a country or city." required/>
              <TextField fullWidth type="text" label="Phone" helperText="The active number as your contact." required/>
              <TextField fullWidth type="text" label="Intro" multiline minRows={3} maxRows={10}/>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={false}>Save changes</Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}