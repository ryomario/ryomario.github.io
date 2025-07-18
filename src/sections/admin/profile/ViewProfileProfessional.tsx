'use client';

import { Form, RHFField } from "@/components/formHook";
import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext";
import { EMPTY_PROFILE_DATA } from "@/factories/profileDataFactory";
import { IProfileProfessional } from "@/types/IProfile";
import { useForm } from "react-hook-form";

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import { createFilterOptions } from "@mui/material/useAutocomplete";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import * as RepoProfileData_server from "@/db/repositories/RepoProfileData.server";

type AutocompleteOptionType = {
  value: string;
  title: string;
  inputValue?: string;
}

const defaultValues = EMPTY_PROFILE_DATA.professional;

const filter = createFilterOptions<AutocompleteOptionType>();

export function ViewProfileProfessional() {
  const profileData = useProfileData();
  const updateProfileData = useUpdateProfileData();

  const methods = useForm<IProfileProfessional>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
    setError,
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      let error = false;

      if (Array.isArray(values.languages)) {
        let emptyLangs = true;
        values.languages.forEach((lang, index) => {
          if (lang.name && lang.level) {
            emptyLangs = false;
          }
          if (lang.name && !lang.level) {
            setError(`languages.${index}.level`, {
              type: 'required',
              message: 'Choose your proficiency',
            });
            error = true;
          }
        });

        if (emptyLangs) {
          setError('languages', {
            type: 'required',
            message: 'Are you a human? At least there is body language',
          });
          error = true;
        }
      }

      if (error) {
        return;
      }

      await RepoProfileData_server.updateProfileProfessional(values);

      updateProfileData(await RepoProfileData_server.getAll(true));
    } catch (error) {
      console.log('submit error', error);
    }
  }, (errors) => console.log(errors));

  useEffect(() => {
    if (profileData.professional) {
      reset({
        ...profileData.professional,
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
        <RHFField.ToggleButtonGroup
          name="status"
          label="What is your current employment status?"
          color="primary"
          size="small"
          sx={{ flexWrap: 'wrap' }}
          enforceValue
          rules={{ required: { value: true, message: 'Please choose one!' } }}
        >
          {
            ([
              { value: 'employed', name: 'Employed' },
              { value: 'unemployed', name: 'Unemployed' },
              { value: 'study', name: 'Studying' },
              { value: 'military_service', name: 'In military service' },
            ] as { value: IProfileProfessional['status'], name: string }[]).map(({ value, name }) => (
              <ToggleButton fullWidth={false} value={value} key={value}>{name}</ToggleButton>
            ))
          }
        </RHFField.ToggleButtonGroup>

        <RHFField.Autocomplete
          name="professions"
          optionsKey="professional.professions"
          defaultOptions={['Web Developer', 'Front-end Developer', 'Back-end Developer']}
          label="What are your professions?"
          fullWidth
          multiple
          rules={{ required: { value: true, message: 'Are you newbie?' } }}
        />

        <RHFField.Autocomplete
          name="job_industry"
          optionsKey="professional.job_industry"
          defaultOptions={['Software', 'Games', 'Mobile Apps', 'Internet']}
          label="What industries do you work in?"
          fullWidth
          multiple
        />

        <RHFField.ToggleButtonGroup
          name="year_of_experience"
          label="How many years of work experience do you have?"
          color="primary"
          size="small"
          sx={{ flexWrap: 'wrap' }}
          enforceValue
          rules={{ required: { value: true, message: 'Please choose one!' } }}
        >
          {
            ([
              { value: 0, name: 'Less than 1 year' },
              { value: 1, name: '1-2 years' },
              { value: 2, name: '2-4 years' },
              { value: 4, name: '4-6 years' },
              { value: 6, name: '6-10 years' },
              { value: 10, name: '10-15 years' },
              { value: 15, name: 'More than 15 years' },
            ] as { value: IProfileProfessional['year_of_experience'], name: string }[]).map(({ value, name }) => (
              <ToggleButton fullWidth={false} value={`${value}`} key={value}>{name}</ToggleButton>
            ))
          }
        </RHFField.ToggleButtonGroup>

        <RHFField.ToggleButtonGroup
          name="relevant_career_year_of_experience"
          label="How many years of relevant career experience do you have?"
          helperText="For example, if you are changing your career from an enginer (with 4 years of experience) to a designer (without any relevant experience), please select “<1” year of work experience."
          color="primary"
          size="small"
          sx={{ flexWrap: 'wrap' }}
          enforceValue
          rules={{ required: { value: true, message: 'Please choose one!' } }}
        >
          {
            ([
              { value: 0, name: 'Less than 1 year' },
              { value: 1, name: '1-2 years' },
              { value: 2, name: '2-4 years' },
              { value: 4, name: '4-6 years' },
              { value: 6, name: '6-10 years' },
              { value: 10, name: '10-15 years' },
              { value: 15, name: 'More than 15 years' },
            ] as { value: IProfileProfessional['relevant_career_year_of_experience'], name: string }[]).map(({ value, name }) => (
              <ToggleButton fullWidth={false} value={`${value}`} key={value}>{name}</ToggleButton>
            ))
          }
        </RHFField.ToggleButtonGroup>

        <RHFField.ToggleButtonGroup
          name="managed_people"
          label="What is the max number of people whom you’d managed in the previous roles?"
          color="primary"
          size="small"
          sx={{ flexWrap: 'wrap' }}
          enforceValue
        >
          {
            ([
              { value: 0, name: 'None' },
              { value: 1, name: '1-5 people' },
              { value: 5, name: '5-10 people' },
              { value: 10, name: '10-15 people' },
              { value: 15, name: '15+ people' },
            ] as { value: IProfileProfessional['managed_people'], name: string }[]).map(({ value, name }) => (
              <ToggleButton fullWidth={false} value={`${value}`} key={value}>{name}</ToggleButton>
            ))
          }
        </RHFField.ToggleButtonGroup>

        <RHFField.Autocomplete
          name="skills"
          optionsKey="professional.skills"
          defaultOptions={['PHP', 'JavaScript', 'NodeJS', 'SQL', 'HTML/CSS']}
          label="What are your areas of expertise?"
          fullWidth
          multiple
          rules={{ required: { value: true, message: 'Just type "breathe"!' } }}
        />

        <RHFField.Select
          name="last_education"
          label="Your highest level of education"
          fullWidth
        >
          {[
            { value: 'less_high_school', label: 'Less than high school' },
            { value: 'high_school', label: 'High school' },
            { value: 'associate', label: 'Associate' },
            { value: 'bachelor', label: 'Bachelor' },
            { value: 'master', label: 'Master' },
            { value: 'doctoral', label: 'Doctoral' },
          ].map(({ value, label }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </RHFField.Select>

        <RHFField.Array
          name="languages"
          label="Languages"
          defaultValue={[
            { name: '', level: '' } as any,
          ]}
          rules={{ minLength: { value: 1, message: 'Are you a human?' } }}
          renderInput={({ field, index, fieldLength, remove, append }) => (
            <Stack
              key={field.id}
              direction="row"
              spacing={2}
              mb={2}
            >
              <RHFField.Autocomplete
                placeholder="Language"
                name={`languages.${index}.name`}
                optionsKey="professional.languages.name"
                defaultOptions={['Indonesian (Bahasa Indonesia)', 'English (English)']}
                fullWidth
              />
              <Box display="flex" gap={2} alignItems="flex-start">
                <RHFField.Select
                  name={`languages.${index}.level`}
                  displayEmpty
                  placeholder="Proficiency"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="" disabled>
                    <em>Proficiency</em>
                  </MenuItem>
                  {[
                    { value: '1', label: 'Beginner' },
                    { value: '2', label: 'Intermediate' },
                    { value: '3', label: 'Fluent' },
                    { value: '4', label: 'Professional' },
                    { value: '5', label: 'Native or Bilingual' },
                  ].map(({ value, label }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </RHFField.Select>
                {
                  fieldLength > 1 && (
                    <IconButton sx={{ mt: 1 }} onClick={() => remove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
                <IconButton sx={{ mt: 1, visibility: index == (fieldLength - 1) ? 'visible' : 'hidden' }} onClick={() => append({ name: '', level: '' })}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Stack>
          )}
        />

        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
          <Button type="submit" variant="contained" color="success" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
        </Stack>
      </Card>
    </Form>
  );
}
