import { Form, RHFField } from "@/components/formHook";
import * as RepoProjectsServer from "@/db/repositories/RepoProjects.server";
import { IProject } from "@/types/IProject";
import { Logger } from "@/utils/logger";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FieldErrors, useForm } from "react-hook-form";

import InsertLinkIcon from '@mui/icons-material/InsertLink';
import InputAdornment from "@mui/material/InputAdornment";
import { isValidURL } from "@/lib/url";
import { getErrorMessage } from "@/utils/errorMessage";

type Props = {
  values?: IProject;
  afterSubmit?: () => void;
  refTags?: IProject['tags'];
}

export function AdminProjectForm({
  values,
  afterSubmit,
  refTags = ['PHP', 'NodeJS', 'Game', 'Web Application', 'Mini Project'],
}: Props) {
  const methods = useForm<IProject>({
    mode: 'all',
    defaultValues: {
      title: '',
      desc: '',
      tags: [],
      previews: [],
      link_repo: '',
      link_demo: '',
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    values,
    resolver: (values, _context, _options) => {
      const errors: FieldErrors<IProject> = {};

      if (!values.title.trim()) {
        errors.title = {
          type: 'required',
          message: 'Project Title is required!',
        };
      }

      if (!values.createdAt || (values.createdAt instanceof Date && isNaN(values.createdAt.getTime()))) {
        errors.createdAt = {
          type: 'required',
          message: 'Date Created is required!',
        };
      }

      if (!values.tags.length) {
        errors.tags = {
          type: 'required',
          message: 'Choose at least one tag',
        };
      }

      if (!values.previews.length) {
        errors.previews = {
          type: 'required',
          message: 'Upload at least one preview',
        };
      }

      if (values.link_repo && !isValidURL(values.link_repo)) {
        errors.link_repo = {
          type: 'value',
          message: 'Not valid URL',
        };
      }

      if (values.link_demo && !isValidURL(values.link_demo)) {
        errors.link_demo = {
          type: 'value',
          message: 'Not valid URL',
        };
      }

      return {
        values,
        errors,
      };
    }
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
    setValue,
  } = methods;

  const formValues = watch();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await RepoProjectsServer.saveOrUpdate(values);
      if (!result) {
        throw new Error('Internal error');
      }

      if (afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      Logger.error(getErrorMessage(error), 'Submit admin project');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, date created..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Title *</Typography>
          <RHFField.TextField name="title" placeholder="Project name or Application name" />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Description</Typography>
          <RHFField.TextField name="desc" placeholder="Explain about the project or your contribution if this is a team project" multiline rows={3} />
        </Stack>

        <Stack spacing={1} direction="row">
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">Date Created *</Typography>
            <RHFField.DatePicker name="createdAt" format="DD MMMM YYYY" />
          </Stack>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="subtitle2">Last Updated *</Typography>
            <RHFField.DatePicker name="updatedAt" format="DD MMMM YYYY" />
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
          <Typography variant="subtitle2">Tags *</Typography>
          <RHFField.Autocomplete
            name="tags"
            optionsKey="project.tags"
            defaultOptions={refTags}
            fullWidth
            multiple
            disableCloseOnSelect
          />
        </Stack>

        <RHFField.TextField
          name="link_repo"
          label="Link Repository"
          placeholder="Ex: https://github.com/ryomario/[project_name]"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <InsertLinkIcon />
                </InputAdornment>
              ),
            }
          }}
        />

        <RHFField.TextField
          name="link_demo"
          label="Link Demo"
          placeholder="Ex: https://ryomario.github.io/[project_name]"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <InsertLinkIcon />
                </InputAdornment>
              ),
            }
          }}
        />
      </Stack>
    </Card>
  );

  const renderPreviews = () => (
    <Card>
      <CardHeader title="Previews" subheader="Project previews, captured from demo project..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={2} sx={{ p: 3 }}>
        <RHFField.UploadFile
          name="previews"
          multiple
          onRemove={(inputFile) => {
            setValue(
              'previews',
              formValues.previews.filter(file => file !== inputFile),
              { shouldValidate: true, shouldDirty: true }
            );
          }}
          onRemoveAll={() => setValue('previews', [], { shouldValidate: true, shouldDirty: true })}
          onReordered={(newFiles) => setValue('previews', newFiles, { shouldValidate: true, shouldDirty: true })}
          thumbnail
        />
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <RHFField.Switch
        name="published"
        label="Project pubished?"
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
        {renderPreviews()}
        {renderActions()}
      </Stack>
    </Form>
  );
}