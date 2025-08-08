import { Form, RHFField } from "@/components/formHook";
import * as RepoEducationsServer from "@/db/repositories/RepoEducations.server";
import { EDUCATION_DEGREES, IEducation, IFormEducation } from "@/types/IEducation";
import { Logger } from "@/utils/logger";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

type Props = {
  values?: IEducation;
  afterSubmit?: () => void;
  refMajors?: IEducation['majors'];
}

export function AdminEducationForm({
  values,
  afterSubmit,
  refMajors = [],
}: Props) {
  const methods = useForm<IFormEducation>({
    mode: 'all',
    defaultValues: {
      schoolName: '',
      description: '',
      degree: '',
      activities: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      majors: [],
      logo: null,
      gpa: null,
      gpa_scale: null,
      hidden: false,
    },
    values,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await RepoEducationsServer.saveOrUpdate(values);
      if (!result) {
        throw new Error('Internal error');
      }

      if (afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      Logger.debug(error, 'Submit admin education');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Details" subheader="School name, degree, major..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Box>
            <RHFField.UploadAvatar
              name="logo"
            />
          </Box>
          <Stack flexGrow={1} spacing={2}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">School Name</Typography>
              <RHFField.TextField name="schoolName" rules={{ required: { value: true, message: 'School Name is required!' } }} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Degree</Typography>
              <RHFField.Autocomplete
                name="degree"
                optionsKey="education.degrees"
                defaultOptions={EDUCATION_DEGREES}
                fullWidth
                rules={{ required: { value: true, message: 'Please select one!' } }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Major</Typography>
          <RHFField.Autocomplete
            name="majors"
            optionsKey="education.majors"
            defaultOptions={refMajors}
            fullWidth
            multiple
            rules={{ required: { value: true, message: 'At least one major' } }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">Start Date</Typography>
            <RHFField.TextField
              name="startYear"
              placeholder="Start year"
              type="number"
              rules={{ required: { value: true, message: 'Start year is required!' } }}
            />
          </Stack>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">End Date (or expected)</Typography>
            <RHFField.TextField
              name="endYear"
              placeholder="End year"
              type="number"
              rules={{ required: { value: true, message: 'End year is required!' } }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader title="Properties" subheader="Other attributes and informations..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Activities and Societies</Typography>
          <RHFField.TextField name="activities" placeholder="Eg. student union, sport team, etc." multiline rows={3} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">GPA</Typography>
            <RHFField.TextField
              name="gpa"
              type="number"
            />
          </Stack>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">Scale of GPA</Typography>
            <RHFField.TextField
              name="gpa_scale"
              placeholder="GPA Scale (e.g 4 or 5)"
              type="number"
            />
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Description</Typography>
          <RHFField.TextField name="description" placeholder="Describe what your learning experience and projects." multiline rows={3} />
        </Stack>
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
        disabled={!isDirty}
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