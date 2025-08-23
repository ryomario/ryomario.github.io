'use client';

import { Form, RHFField } from "@/components/formHook";
import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext";
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory";
import { IProfileSocialLinks } from "@/types/IProfile";
import { useForm } from "react-hook-form";

import * as RepoProfileData_server from "@/db/repositories/RepoProfileData.server"
import { useEffect } from "react";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import { CodepenIcon } from "@/assets/icons/socials/codepen";
import { GithubIcon } from "@/assets/icons/socials/githubIcon";
import { LinkedinIcon } from "@/assets/icons/socials/linkedin";
import { SocialWebsiteIcon } from "@/assets/icons/socials/websiteIcon";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const defaultValues = EMPTY_PROFILE_DATA.socialLinks;

export function ViewProfileSocials() {
  const profileData = useProfileData();
  const updateProfileData = useUpdateProfileData();

  const methods = useForm<IProfileSocialLinks>({
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await RepoProfileData_server.updateProfileSocialLinks(values);

      updateProfileData();
    } catch (error) {
      console.log('submit error', error);
    }
  });

  useEffect(() => {
    if (profileData.socialLinks) {
      reset({
        ...profileData.socialLinks,
      });
    }
  }, [profileData]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {(Object.keys(defaultValues) as (keyof IProfileSocialLinks)[]).map((social) => (
          <RHFField.TextField
            key={social}
            name={social}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {social == 'codepen' && <CodepenIcon size={24} />}
                    {social == 'github' && <GithubIcon size={24} />}
                    {social == 'linkedin' && <LinkedinIcon size={24} />}
                    {social == 'website' && <SocialWebsiteIcon size={24} />}
                  </InputAdornment>
                ),
              },
            }}
          />
        ))}

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <Button type="submit" variant="contained" color="success" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
        </Stack>
      </Card>
    </Form>
  );
}