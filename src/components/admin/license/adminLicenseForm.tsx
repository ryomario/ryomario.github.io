import { Form, RHFField } from "@/components/formHook";
import * as RepoLicensesServer from "@/db/repositories/RepoLicenses.server";
import { getAllMonthsName } from "@/lib/date";
import { IFormLicense, ILicense } from "@/types/ILicense";
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
  values?: ILicense;
  afterSubmit?: () => void;
}

export function AdminLicenseForm({
  values,
  afterSubmit,
}: Props) {
  const methods = useForm<IFormLicense>({
    mode: 'all',
    defaultValues: {
      name: '',
      orgName: '',
      logo: null,
      startDate_month: new Date().getMonth(),
      startDate_year: new Date().getFullYear(),
      endDate_month: new Date().getMonth(),
      endDate_year: new Date().getFullYear(),
      credentialId: '',
      credentialUrl: '',
      hidden: false,
    },
    values,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
    setValue,
  } = methods;

  const [endDate_month, endDate_year] = watch(['endDate_month', 'endDate_year']);
  const isCredentialCannotExpired = useMemo(() => !endDate_month && !endDate_year, [endDate_month, endDate_year]);
  const setCredentialCannotExpired = useCallback((checked: boolean) => {
    if (!checked) {
      setValue('endDate_month', new Date().getMonth());
      setValue('endDate_year', new Date().getFullYear());
    } else {
      setValue('endDate_month', null);
      setValue('endDate_year', null);
    }
  }, [endDate_month, endDate_year, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await RepoLicensesServer.saveOrUpdate(values);
      if (!result) {
        throw new Error('Internal error');
      }

      if (afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      Logger.error(error, 'submit admin license');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Licenses or Certifications" subheader="License Name, Issuing Organization, credential..." sx={{ mb: 3 }} />

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
              <Typography variant="subtitle2">Name</Typography>
              <RHFField.TextField name="name" rules={{ required: { value: true, message: 'License or Certification Name is required!' } }} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Issuing Organization</Typography>
              <RHFField.TextField name="orgName" rules={{ required: { value: true, message: 'Organization name is required!' } }} />
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Issue Date</Typography>
          <Stack direction="row" spacing={1}>
            <RHFField.Select
              name="startDate_month"
              rules={{ required: { value: true, message: 'Issue Date Month is required!' } }}
            >
              {getAllMonthsName().map((label, value) => (
                <MenuItem key={`startDate-month-${value}`} value={value}>{label}</MenuItem>
              ))}
            </RHFField.Select>
            <RHFField.TextField
              name="startDate_year"
              placeholder="Year"
              type="number"
              rules={{ required: { value: true, message: 'Issue Date Year is required!' } }}
            />
          </Stack>
        </Stack>

        {
          !isCredentialCannotExpired && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Expiration Date</Typography>
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
              checked={isCredentialCannotExpired}
              onChange={(event) => setCredentialCannotExpired(event.target.checked)}
            />
          }
          sx={{ width: 'max-content' }}
        />

        <RHFField.TextField
          name="credentialId"
          label="Credential ID"
        />

        <RHFField.TextField
          name="credentialUrl"
          label="Credential URL"
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
        {renderActions()}
      </Stack>
    </Form>
  );
}