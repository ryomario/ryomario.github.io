import Box, { BoxProps } from "@mui/material/Box";
import FormControlLabel, { FormControlLabelProps } from "@mui/material/FormControlLabel";
import { FormHelperTextProps } from "@mui/material/FormHelperText";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HelperText } from "../helperText";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

export type RHFCheckboxProps = Omit<FormControlLabelProps, 'control'> & {
  name: string;
  helperText?: React.ReactNode;
  slotProps?: {
    wrapper?: BoxProps;
    checkbox?: CheckboxProps;
    helperText?: FormHelperTextProps;
  };
}

export function RHFCheckbox({
  sx,
  name,
  helperText,
  label,
  slotProps,
  ...rest
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box {...slotProps?.wrapper}>
          <FormControlLabel
            label={label}
            control={
              <Checkbox
                {...field}
                checked={field.value}
                {...slotProps?.checkbox}
                slotProps={{
                  input: {
                    id: `${name}-checkbox`,
                    ...(!label && { 'aria-label': `${name} checkbox` }),
                    ...slotProps?.checkbox?.slotProps?.input,
                  }
                }}
              />
            }
            sx={[{ mx: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...rest}
          />

          <HelperText
            {...slotProps?.helperText}
            errorMessage={error?.message}
            helperText={helperText}
          />
        </Box>
      )}
    />
  )
}