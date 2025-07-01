'use client';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Form, RHFField } from "@/components/formHook";
import { useForm } from "react-hook-form";
import { IProfileForm } from "@/types/IProfile";

import * as RepoProfileData_server from "@/db/repositories/RepoProfileData.server"
import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext";
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory";
import { useEffect } from "react";

export function ViewProfile() {
  const profileData = useProfileData()
  const updateProfileData = useUpdateProfileData()

  const methods = useForm<IProfileForm>({
    defaultValues: EMPTY_PROFILE_DATA,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = methods;

  const hireable = watch('hireable');

  const onSubmit = handleSubmit(async (values) => {
    try {
      await RepoProfileData_server.updateProfileData(values);
      
      updateProfileData(await RepoProfileData_server.getAll());
    } catch (error) {
      console.log('submit error',error);
    }
  });

  useEffect(() => {
    if(profileData) {
      reset({
        ...profileData,
      });
    }
  },[profileData]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Chip
              variant="filled"
              size="small"
              label={hireable ? "Hireable" : "Not Hireable"}
              color={
                hireable ? 'info' : 'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            />
            <RHFField.UploadAvatar
              name="profile_picture"
              rules={{ required: { value: true, message: 'Please select your profile picture!' },  }}
              slotProps={{
                wrapper: { mb: 5 },
              }}
            />

            <RHFField.Switch
              name="hireable"
              labelPlacement="start"
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
              <RHFField.TextField
                name="name"
                type="text"
                label="Full name"
                rules={{ required: { value: true, message: 'Don\'t you have a name?' },  }}
              />
              <RHFField.TextField
                name="email"
                type="email"
                label="Email address"
                rules={{
                  required: { value: true, message: 'Don\'t you even have an Email Address?' },
                  pattern: { value: /^\S+@\S+$/i, message: 'Your Email Address is not valid!' },
                }}
              />
              <RHFField.TextField
                name="phone"
                type="tel"
                label="Phone"
                helperText="The active number as your contact."
                rules={{
                  required: { value: true, message: 'Don\'t forget your phone number!' },
                }}
              />
              <RHFField.TextField
                name="address"
                type="text"
                label="Current Residence"
                helperText="Please input a country or city."
                rules={{
                  required: { value: true, message: 'Don\'t forget your home!' },
                }}
              />
            </Box>
            <RHFField.TextField
              name="headline"
              type="text"
              label="Headline"
              rules={{
                required: { value: true, message: 'Please input your headline!' },
              }}
              sx={{ mt: 3 }}
            />
            <RHFField.TextField
              name="intro"
              type="text"
              label="Intro"
              multiline minRows={3} maxRows={10}
              rules={{
                required: { value: true, message: 'Please introduce yourself!' },
              }}
              sx={{ mt: 3 }}
            />

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" color="success" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  )
}