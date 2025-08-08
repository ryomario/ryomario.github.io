import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectProps } from "@mui/material/Select";
import React from "react";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

export type RHFSelectProps = SelectProps & {
  name: string;
  helperText?: React.ReactNode;
  children: React.ReactNode;
  placeholder?: string;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
};

export function RHFSelect({
  name,
  label,
  children,
  helperText,
  placeholder,
  rules,
  ...rest
}: RHFSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error }}) => (
        <FormControl error={!!error} fullWidth>
          {!!label && <InputLabel id={labelId}>{label}</InputLabel>}
          <Select
            {...field}
            label={label}
            labelId={labelId}
            fullWidth
            renderValue={rest.displayEmpty && field.value === '' && placeholder ? () => placeholder : undefined}
            {...rest}
            sx={[
              { color: (rest.displayEmpty && field.value === '' && placeholder) ? 'text.disabled' : 'inherit' },
              ...(Array.isArray(rest.sx) ? rest.sx : [rest.sx]),
            ]}
          >
            {children}
          </Select>
          {(error?.message || helperText) && (
            <FormHelperText sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {error?.message || helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}