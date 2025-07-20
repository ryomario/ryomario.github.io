import { UploadAvatar } from "@/components/admin/inputs/file/UploadAvatar";
import { UploadProps } from "@/types/IFileUpload";
import Box, { BoxProps } from "@mui/material/Box";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";
import { HelperText } from "../helperText";
import { UploadFile } from "@/components/admin/inputs/file/UploadFile";

export type RHFUploadProps = UploadProps & {
  name: string;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  slotProps?: {
    wrapper?: BoxProps;
  };
}

export function RHFUploadAvatar({
  name,
  slotProps,
  rules,
  ...rest
}: RHFUploadProps) {
  const { control, setValue } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true, shouldDirty: true });
        }

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...rest}/>

            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }}/>
          </Box>
        );
      }}
    />
  )
}

export function RHFUploadFile({
  name,
  multiple,
  helperText,
  rules,
  ...rest
}: RHFUploadProps) {
  const { control, setValue } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true, shouldDirty: true });
        }

        return <UploadFile {...uploadProps} value={field.value} onDrop={onDrop} {...rest}/>;
      }}
    />
  )
}