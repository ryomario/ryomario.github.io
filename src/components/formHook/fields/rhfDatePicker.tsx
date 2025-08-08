import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import React from "react";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form";
import dayjs from "dayjs";

export type RHFDatePickerProps = DatePickerProps & {
  name: string;
  rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate">;
  helperText?: React.ReactNode;
};

export function RHFDatePicker({
  name,
  helperText,
  slotProps,
  rules,
  ...rest
}: RHFDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(value) => {
            field.onChange(dayjs(value).toDate());
          }}
          slotProps={{
            ...slotProps,
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? helperText,
              ...slotProps?.textField,
            },
          }}
          {...rest}
        />
      )}
    />
  );
}