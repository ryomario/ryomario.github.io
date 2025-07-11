import { Form, RHFField } from "@/components/formHook";
import { getAllMonthsName } from "@/lib/date";
import { IWorkExperience, WorkEmploymentType } from "@/types/IWorkExperience"
import { Logger } from "@/utils/logger";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  values?: IWorkExperience;
  afterSubmit?: () => void;
}

export function AdminWorkForm({
  values,
  afterSubmit,
}: Props) {
  const methods = useForm<IWorkExperience>({
    mode: 'all',
    defaultValues: {
      companyName: '',
      description: '',
      employmentType: WorkEmploymentType.CONTRACT,
      jobTitle: '',
      location: [],
      skills: [],
      logo: null,
      startDate_month: new Date().getMonth(),
      startDate_year: new Date().getFullYear(),
      endDate_month: new Date().getMonth(),
      endDate_year: new Date().getFullYear(),
      hidden: false,
    },
    values,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const [endDate_month, endDate_year] = watch(['endDate_month','endDate_year']);
  const isStillWorkHere = useMemo(() => !endDate_month && !endDate_year,[endDate_month, endDate_year]);
  const setStillWorkHere = useCallback((checked: boolean) => {
    if(!checked) {
      setValue('endDate_month', new Date().getMonth());
      setValue('endDate_year', new Date().getFullYear());
    } else {
      setValue('endDate_month', null);
      setValue('endDate_year', null);
    }
  },[endDate_month, endDate_year, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log('submit', values);

      if(afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      Logger.debug(error,'Submit admin work');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Details" subheader="Job Title, short description, company info..." sx={{ mb: 3 }}/>

      <Divider/>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Box>
            <RHFField.UploadAvatar
              name="logo"
            />
          </Box>
          <Stack flexGrow={1} spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Company Name</Typography>
              <RHFField.TextField name="companyName" rules={{ required: { value: true, message: 'Company Name is required!' } }}/>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Job Title</Typography>
              <RHFField.TextField name="jobTitle" placeholder="Ex: Web Developer..." rules={{ required: { value: true, message: 'Job Title is required!' } }}/>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Location</Typography>
          <RHFField.Autocomplete
            name="location"
            optionsKey="workExperience.location"
            defaultOptions={['Jawa Tengah, Indonesia']}
            fullWidth
            multiple
            rules={{ required: { value: true, message: 'Are you a fictional human?' } }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Description</Typography>
          <RHFField.TextField name="description" placeholder="Explain what your job did in the company" multiline rows={3} />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader title="Properties" subheader="Other attributes and informations..." sx={{ mb: 3 }}/>

      <Divider/>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Employment Type</Typography>
          <RHFField.Select
            name="employmentType"
            fullWidth
            rules={{ required: { value: true, message: 'Are you a fictional human?' } }}
          >
            {[
              { value: WorkEmploymentType.CONTRACT, label: 'Contract' },
              { value: WorkEmploymentType.FREELANCE, label: 'Freelance' },
              { value: WorkEmploymentType.FULL_TIME, label: 'Full-time' },
              { value: WorkEmploymentType.INTERNSHIP, label: 'Internship' },
              { value: WorkEmploymentType.PART_TIME, label: 'Part-time' },
              { value: WorkEmploymentType.TEMPORARY, label: 'Temporary' },
              { value: WorkEmploymentType.VOLUNTEER, label: 'Volunteer' },
            ].map(({ value, label }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </RHFField.Select>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">The skills you use in your job</Typography>
          <RHFField.Autocomplete
            name="skills"
            optionsKey="professional.skills"
            defaultOptions={['PHP', 'JavaScript', 'NodeJS', 'SQL', 'HTML/CSS']}
            fullWidth
            multiple
            rules={{ required: { value: true, message: 'What, "blind salary"!' } }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Start Date</Typography>
          <Stack direction="row" spacing={1}>
            <RHFField.Select
              name="startDate_month"
              rules={{ required: { value: true, message: 'Start Month is required!' } }}
            >
              {getAllMonthsName().map((label, value) => (
                <MenuItem key={`startDate-month-${value}`} value={value}>{label}</MenuItem>
              ))}
            </RHFField.Select>
            <RHFField.TextField
              name="startDate_year"
              placeholder="Year"
              type="number"
              rules={{ required: { value: true, message: 'Start Year is required!' } }}
            />
          </Stack>
        </Stack>

        {
          !isStillWorkHere && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">End Date</Typography>
              <Stack direction="row" spacing={1}>
                <RHFField.Select
                  name="endDate_month"
                >
                  {getAllMonthsName().map((label, value) => (
                    <MenuItem key={`endDate-month-${value}`} value={value}>{label}</MenuItem>
                  ))}
                </RHFField.Select>
                <RHFField.TextField
                  name="endDate_year"
                  placeholder="Year"
                  type="number"
                />
              </Stack>
            </Stack>
          )
        }

        <FormControlLabel
          label="I currently work here"
          control={
            <Checkbox
              checked={isStillWorkHere}
              onChange={(event) => setStillWorkHere(event.target.checked)}
            />
          }
          sx={{ width: 'max-content' }}
        />
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <RHFField.Switch
        name="hidden"
        label="Hide from public"
        slotProps={{
          wrapper: { flexGrow: 1 }
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!values ? 'Create' : 'Save'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}