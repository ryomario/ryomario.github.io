import { transformNumberValue, transformNumberValueOnBlur, transformNumberValueOnChange } from "@/utils/formInputs";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  rules,
  ...rest
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => (
        <TextField
          {...field}
          fullWidth
          type={isNumberType ? 'text' : type}
          value={isNumberType ? transformNumberValue(field.value) : field.value}
          onChange={(event) => {
            const transformedValue =
              isNumberType
              ? transformNumberValueOnChange(event.target.value)
              : event.target.value;
            
            field.onChange(transformedValue);
          }}
          onBlur={(event) => {
            const transformedValue =
              isNumberType
              ? transformNumberValueOnBlur(event.target.value)
              : event.target.value;
            
            field.onChange(transformedValue);
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          slotProps={{
            ...slotProps,
            htmlInput: {
              autoComplete: 'off',
              ...slotProps?.htmlInput,
              ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
            },
          }}
          {...rest}
        />
      )}
    />
  );
}